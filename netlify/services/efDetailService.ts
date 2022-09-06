import fetch, { HeadersInit } from 'node-fetch';
import {
  EF_Event_Detail,
  EF_Event_Detail_Response
} from '../models/EF_Event_Detail';

export default async function getEventById(eventId: string): Promise<EF_Event_Detail[]> {
  const auth = process.env.EF_AUTH;
  const cookie = process.env.EF_COOKIE;
  const uri = process.env.EF_URL_EVENT_BY_ID;

  if (!auth || !cookie || !uri) {
    throw new Error('no ef uri or no auth');
  }

  const myHeaders: HeadersInit = {
    Authorization: auth,
    Cookie: cookie
  };

  const resp = await fetch(uri + '&id=' + eventId, {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  });

  const response = (await resp.json()) as EF_Event_Detail_Response;
  const list: EF_Event_Detail[] | unknown = response.events;

  const efEventDetails = list as EF_Event_Detail[];
  if (!efEventDetails || !efEventDetails.length) {
    throw new Error('no EventsDetails found on EF');
  }
  return efEventDetails;
}
