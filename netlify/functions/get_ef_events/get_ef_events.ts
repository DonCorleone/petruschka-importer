import { Handler } from "@netlify/functions";
import { MongoClient } from "mongodb";
import fetch from "node-fetch";

const API_URI =
  "https://eventfrog.ch/api/web/events.modifyInfo.de.json?accessibleForAction=manage_event&distinctGroup=false&temporalState=future&page=1&perPage=50&sortBy=eventBegin&asc=true&state=draft&state=published&selector=organizer";

export interface EF_Event {
  id: string;
  modifyDate?: Date;
}

export interface EF_Event_Response {
  events: EF_Event[];
}

async function getEvents(): Promise<EF_Event[]> {
  try {
    const auth = process.env.EF_AUTH;
    const cookie = process.env.EF_COOKIE;

    if (!auth || !cookie) {
      throw new Error("no auth");
    }

    var myHeaders: HeadersInit = {
      Authorization: auth,
      Cookie: cookie,
    };

    const resp = await fetch(API_URI, {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    });

    const response = (await resp.json()) as EF_Event_Response;

    const list: EF_Event[] | unknown = response.events;

    const monsterList = list as EF_Event[];

    if (!monsterList || !monsterList.length) {
      throw new Error("no monsters");
    }

    return monsterList;
  } catch (err) {
    throw new Error("froggy not found " + err);
  }
}

export async function insertEventIntoDb(
  efEvents: EF_Event[]
): Promise<unknown> {
  const uri = process.env.MONGODB_URI;
  const db = process.env.MONGODB_COLLECTION;

  if (uri && db) {
    const mongoClient = new MongoClient(uri);
    const clientPromise = mongoClient.connect();

    const database = (await clientPromise).db(process.env.MONGODB_DATABASE);
    const collectionName = process.env.MONGODB_COLLECTION;
    if (collectionName) {
      const collection = database.collection<EF_Event>(collectionName);

      let updateCounter = 0;
      efEvents.forEach((efEvent) => {
        const result = collection.updateOne(
          { id: efEvent.id },
          { $set: { ...efEvent } },
          { upsert: true }
        );
        result
          .then((updateResult) => (updateCounter += updateResult.matchedCount))
          .catch((reason) => console.log(reason));
      });
      return {
        statusCode: 200,
        body: JSON.stringify(efEvents),
      };
    } else {
      return { statusCode: 500, body: "no collectionName - env" };
    }
  } else {
    return { statusCode: 500, body: "no uri or db - env" };
  }
}

export const handler: Handler = async (event, context) => {
  try {
    const data = await getEvents();
    const result = await insertEventIntoDb(data);
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(result),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application.json",
      },
      body: JSON.stringify({
        message: err.message,
      }),
    };
  }
};
