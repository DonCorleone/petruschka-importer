import { Handler } from "@netlify/functions";
import fetch from 'node-fetch'

const API_URI = 'https://eventfrog.ch/api/web/events.modifyInfo.de.json?accessibleForAction=manage_event&distinctGroup=false&temporalState=future&page=1&perPage=50&sortBy=eventBegin&asc=true&state=draft&state=published&selector=organizer';

export interface Movies {
  id:         string;
  modifyDate: Date | null;
}


async function getMonsterData():Promise<unknown> {
  try {
    var myHeaders: HeadersInit = {
      "Authorization": "Basic dml0b2Nvcmxlb25lNzdAZ21haWwuY29tOnJlcWppOS14ZXF6b2otcGlKZ2Vu",
      "Cookie": "JSESSIONID=D869EEE6813F51AAEC5874EBC0295947"
    };
  
    const resp = await fetch(API_URI, {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    });
    return resp.json()
  } catch (err){
    throw new Error('froggy not found ' + err);
  }
}

export const handler: Handler = async (event, context) => {

  try {

    const data = await getMonsterData();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }
  } catch (err) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application.json',
      },
      body: JSON.stringify({
        message: err.message,
      }),
    }
  }
};
