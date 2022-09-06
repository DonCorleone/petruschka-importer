import { HandlerResponse } from '@netlify/functions';
import { MongoClient, UpdateResult } from 'mongodb';
import getEvents from '../../services/efService';
import getEventById from '../../services/efDetailService';
import {
  EF_Event_Detail_Response,
  EF_Event_Detail
} from '../../models/EF_Event_Detail';
import {
  EF_Event_Overview,
  EF_Event_Overview_Response
} from '../../models/EF_Event_Overview';

async function insertEventIntoDb(
  efEvents: EF_Event_Overview[]
): Promise<unknown> {
  console.log('Here i am.');

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

  console.log('Here i am.');

  const asyncFunctions: Promise<UpdateResult>[] = [];
  efEvents.forEach((efEvent) => {
    console.log(JSON.stringify(efEvent));

    getEventById(efEvent.id);

    asyncFunctions.push(
      collection.updateOne(
        { id: efEvent.id },
        { $set: { ...efEvent } },
        { upsert: true }
      )
    );
  });
  console.log('finito');
  return await Promise.all(asyncFunctions);
}

export async function handler(): Promise<HandlerResponse> {
  try {
    const data = await getEvents();
    const result = await insertEventIntoDb(data);
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
