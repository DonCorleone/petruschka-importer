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
import getVisibilityByEventId from '../../services/efVisibilityService';
import getEventGroup from '../../services/efGroupService';
import getTickets, {
  getCategoriesFromTicket
} from '../../services/efTicketsService';
import getEventCategories from '../../services/efCategoriesService';
import getPresaleInfoByEventId from '../../services/efPresaleService';
import getEventAgenda, {
  getAgendaFromJson
} from '../../services/efAgendaService';

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
      let eventKey = '';
      let gigTag = '';
      let notificationEmail = '';

      if (uiProps.description) {
        artists = getArtistsFromDesc(uiProps.description);
        eventKey = getMetaInfoFromDesc(
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

      if (eventDetail?.groupId) {
        const group = await getEventGroup(eventDetail?.groupId);
      }

      const visibility = await getVisibilityByEventId(eventDetail?.id ?? '');

      let categories = await getEventCategories(eventDetail?.id ?? '');
      // tickets defined in EF?
      const tickets = await getTickets(eventDetail?.id ?? '');
      if (!categories || !categories.length) {
        categories = getCategoriesFromTicket(tickets.conditions);
      }

      let eventUrl = 'https://eventfrog.ch' + eventDetail?.url;

      if (!categories || !categories.length) {
        // Get TicketInfo from Description
        categories = getCategoriesFromTicket(uiProps.description);

        const agenda = await getEventAgenda(efEvent.id);

        const agendaPrps = getAgendaFromJson(agenda);
        eventUrl = agendaPrps.link ?? 'https://petruschka.ch';
      }

      const presaleInfo = await getPresaleInfoByEventId(eventDetail?.id ?? '');
      const start = new Date(eventDetail?.begin ?? '');
      const _id = start.valueOf();

      asyncFunctions.push(
        collection.updateOne(
          { _id: _id },
          {
            $set: {
              ...eventDetail,
              _id,
              facebookPixelId: eventKey,
              status: 1,
              googleAnalyticsTracker: gigTag,
              notificationEmail,
              start /* eventDetail?.begin */,
              eventInfos: getEventInfos(
                uiProps,
                eventKey,
                eventUrl,
                artists,
                location.title
              ),
              ticketTypes: getTicketTypes(
                visibility,
                categories,
                tickets,
                eventKey,
                presaleInfo
              )
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
