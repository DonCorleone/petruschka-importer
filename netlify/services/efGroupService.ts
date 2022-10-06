import fetch, { HeadersInit } from 'node-fetch';
import { EF_Event_Group } from '../models/EF_Group';

export default async function getEventGroup(
  eventGroupId: string
): Promise<EF_Event_Group> {
  const auth = process.env.EF_AUTH;
  const cookie = process.env.EF_COOKIE;
  const uri = process.env.EF_URL_GROUP;

  if (!auth || !cookie || !uri) {
    throw new Error('no ef uri or no auth');
  }

  const myHeaders: HeadersInit = {
    Authorization: auth,
    Cookie: cookie
  };

  const resp = await fetch(uri + eventGroupId + '.de.json', {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  });

  return (await resp.json()) as EF_Event_Group;
}
