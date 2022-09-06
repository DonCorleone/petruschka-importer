import fetch, { HeadersInit } from 'node-fetch';
import {
  EF_Event_Overview,
  EF_Event_Overview_Response
} from '../models/EF_Event_Overview';

export default async function getEvents(): Promise<EF_Event_Overview[]> {
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
}
