import { Handler, HandlerContext, HandlerEvent } from '@netlify/functions';
import { MongoClient, UpdateResult } from 'mongodb';
import { EF_Event_Detail } from '../../models/EF_Event_Detail';
import getEvents from '../../services/efService';
import getEventById from '../../services/efDetailService';
import getLocationsById from '../../services/efLocationService';
import getEventUiById, {
  getArtistsFromDesc,
  getEventInfos,
  getMetaInfoFromDesc,
  getPropertiesFromJson,
  getTicketTypes
} from '../../services/efUiService';

export async function handler(event: HandlerEvent, context: HandlerContext) {
  try {
    const uri = process.env.MONGODB_URI;
    const db = process.env.MONGODB_COLLECTION;

    if (!(uri && db)) {
      throw new Error('no mongo uri or db - env');
    }

    const mongoClient = new MongoClient(uri);
    const clientPromise = mongoClient.connect();

    const database = (await clientPromise).db(process.env.MONGODB_DATABASE);
    const collectionName = process.env.MONGODB_COLLECTION;

    if (!collectionName) {
      throw new Error('no collectionName - env');
    }

    const collection = database.collection<EF_Event_Detail>(collectionName);
    const efEvents = await getEvents();

    const asyncFunctions: Promise<UpdateResult>[] = [];
    for (const efEvent of efEvents) {
      const eventDetails = await getEventById(efEvent.id);
      const eventUi = await getEventUiById(efEvent.id);

      const uiProps = getPropertiesFromJson(eventUi);

      let artists = '';
      let eventId = '';
      let gigTag = '';
      let notificationEmail = '';

      if (uiProps.description) {
        artists = getArtistsFromDesc(uiProps.description);
        eventId = getMetaInfoFromDesc(
          uiProps.description,
          /<p><em>EventID\:(.+)*<\/em><\/p>/
        );
        gigTag = getMetaInfoFromDesc(
          uiProps.description,
          /<p><em>Aufführung:?:(.*)<\/em><\/p>/
        );
        notificationEmail = getMetaInfoFromDesc(
          uiProps.description,
          /<p><em>Buchungsanfrage per E-Mail an (.+)*<\/em><\/p>/
        );
      }

      const eventDetail = eventDetails.pop();

      const location = await getLocationsById(
        eventDetail?.locationIds?.some ? eventDetail?.locationIds[0] : '-1'
      );

      asyncFunctions.push(
        collection.updateOne(
          { id: efEvent.id },
          {
            $set: {
              ...eventDetail,
              _id: eventDetail?.id,
              facebookPixelId: eventId,
              googleAnalyticsTracker: gigTag,
              notificationEmail,
              start: eventDetail?.begin,
              eventInfos: getEventInfos(
                uiProps,
                eventDetail?.emblemToShow,
                eventDetail?.url,
                artists,
                location.title
              ),
              ticketTypes: getTicketTypes(eventDetail?.emblemToShow)
            }
          },
          { upsert: true }
        )
      );
    }
    const result = await Promise.all(asyncFunctions);
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(result)
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application.json'
      },
      body: JSON.stringify({
        message: err.message
      })
    };
  }
}
