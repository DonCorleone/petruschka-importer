import { HandlerResponse } from '@netlify/functions';
import { MongoClient, UpdateResult } from 'mongodb';
import fetch from 'node-fetch';
import {
  EF_Event_Detail_Response,
  EF_Event_Detail
} from '../models/EF_Event_Detail';
import {
  EF_Event_Overview,
  EF_Event_Overview_Response
} from '../models/EF_Event_Overview';

async function getEventById(eventId: string) {
  try {
    const auth = process.env.EF_AUTH;
    const cookie = process.env.EF_COOKIE;
    const uriOverview = process.env.EF_URL_EVENT_BY_ID;

    if (!auth || !cookie || !uriOverview) {
      throw new Error('no ef uri or no auth');
    }

    const myHeaders: HeadersInit = {
      Authorization: auth,
      Cookie: cookie
    };

    const resp = await fetch(uriOverview + '&id=' + eventId, {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    });

    const response = (await resp.json()) as EF_Event_Detail_Response;

    const list: EF_Event_Detail[] | unknown = response.events;

    const efEvents = list as EF_Event_Detail[];

    if (!efEvents || !efEvents.length) {
      throw new Error('no Events found on EF');
    }

    return efEvents;
  } catch (err) {
    throw new Error('Error ' + err);
  }
}

async function getEvents(): Promise<EF_Event_Overview[]> {
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

    const response = (await resp.json()) as EF_Event_Overview_Response;

    const list: EF_Event_Overview[] | unknown = response.events;

    const efEvents = list as EF_Event_Overview[];

    if (!efEvents || !efEvents.length) {
      throw new Error('no Events found on EF');
    }

    return efEvents;
  } catch (err) {
    throw new Error('Error ' + err);
  }
}

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
