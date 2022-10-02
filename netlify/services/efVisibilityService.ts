import fetch, { HeadersInit } from 'node-fetch';
import { EF_Location_Respose } from '../models/EF_Location';
import {
  EF_Visibility_Response,
  PrjCockpitv3EventVisibility
} from '../models/EF_Visibility';

export default async function getVisibilityByEventId(
  eventId: string
): Promise<string> {
  const auth = process.env.EF_AUTH;
  const cookie = process.env.EF_COOKIE;
  const uri = process.env.EF_URL_EVENT_VISIBILITY;

  if (!auth || !cookie || !uri) {
    throw new Error('no ef uri or no auth');
  }

  const myHeaders: HeadersInit = {
    Authorization: auth,
    Cookie: cookie
  };

  const resp = await fetch(`${uri}?eventid=${eventId}`, {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  });

  const response = (await resp.json()) as EF_Visibility_Response;

  if (!response) {
    throw new Error('visibility not found on EF');
  }

  return (
    response?.['prj-cockpitv3_event_visibility'].fieldsets
      .find((p) => p.visible)
      ?.fields.find((x) => x.name === 'visibleDate')?.value ?? ''
  );
}
