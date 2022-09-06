import fetch, { HeadersInit } from 'node-fetch';
import {
  EF_Event_Detail,
  EF_Event_Detail_Response
} from '../models/EF_Event_Detail';

export default async function getEventById(eventId: string) {
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
