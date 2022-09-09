import { Handler, HandlerContext, HandlerEvent } from '@netlify/functions';
import { MongoClient, UpdateResult } from 'mongodb';
import { EF_Event_Detail } from '../../models/EF_Event_Detail';
import getEvents from '../../services/efService';
import getEventById from '../../services/efDetailService';
import getEventUiById, {
  getArtistsFromDesc,
  getEventIdFromDesc,
  getPropertiesFromJson
} from '../../services/efUiService';
// import getPropertiesFromJson from "../../services/propertyMapper";

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
      const eventDetail = await getEventById(efEvent.id);
      const eventUi = await getEventUiById(efEvent.id);

      const uiProps = getPropertiesFromJson(eventUi);
      
      asyncFunctions.push(
        collection.updateOne(
          { id: efEvent.id },
          { $set: { ...eventDetail.pop() } },
          { upsert: true }
        )
      );

      let artists = '';
      let eventId = '';
      if (uiProps.description){
        artists = getArtistsFromDesc(uiProps.description);
        eventId = getEventIdFromDesc(uiProps.description);
      }
      
      asyncFunctions.push(
          collection.updateOne(
              { id: efEvent.id },
              { $set: { shortDesc: uiProps.shortDesc, description: uiProps.description, artists: artists, facebookPixelId: eventId } },
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
