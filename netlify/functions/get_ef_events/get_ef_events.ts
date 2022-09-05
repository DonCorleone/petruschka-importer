import { HandlerResponse } from '@netlify/functions';
import { MongoClient, UpdateResult } from 'mongodb';
import fetch from 'node-fetch';

const API_URI =
  'https://eventfrog.ch/api/web/events.modifyInfo.de.json?accessibleForAction=manage_event&distinctGroup=false&temporalState=future&page=1&perPage=50&sortBy=eventBegin&asc=true&state=draft&state=published&selector=organizer';

interface EF_Event {
  id: string;
  modifyDate?: Date;
}

interface EF_Event_Response {
  events: EF_Event[];
}

async function getEvents(): Promise<EF_Event[]> {
  try {
    const auth = process.env.EF_AUTH;
    const cookie = process.env.EF_COOKIE;
    const uriOverview = process.env.EF_URL_OVERVIEW;

    if (!auth || !cookie || !uriOverview) {
      throw new Error('no ef uri or no auth');
    }

    const myHeaders: HeadersInit = {
      Authorization: auth,
      Cookie: cookie
    };

    const resp = await fetch(uriOverview, {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    });

    const response = (await resp.json()) as EF_Event_Response;

    const list: EF_Event[] | unknown = response.events;

    const efEvents = list as EF_Event[];

    if (!efEvents || !efEvents.length) {
      throw new Error('no Events found on EF');
    }

    return efEvents;
  } catch (err) {
    throw new Error('Error ' + err);
  }
}

async function insertEventIntoDb(efEvents: EF_Event[]): Promise<unknown> {
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

  const collection = database.collection<EF_Event>(collectionName);

  console.log('Here i am.');

  const asyncFunctions: Promise<UpdateResult>[] = [];
  efEvents.forEach((efEvent) => {
    console.log(JSON.stringify(efEvent));
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
  } catch (err) {
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
