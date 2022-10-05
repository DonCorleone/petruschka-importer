import fetch, { HeadersInit } from 'node-fetch';
import {
  EF_Tickets_Response, Field, Fieldset
} from '../models/EF_Tickets';

export interface EF_Ticket_Info {
  conditions: string;
  logotext: string;
}

export default async function getTickets(
  eventId: string
): Promise<EF_Ticket_Info> {
  const auth = process.env.EF_AUTH;
  const cookie = process.env.EF_COOKIE;
  const uri = process.env.EF_URL_EVENT_TICKETS;

  if (!auth || !cookie || !uri) {
    throw new Error('no ef uri or no auth');
  }

  const myHeaders: HeadersInit = {
    Authorization: auth,
    Cookie: cookie
  };

  const resp = await fetch(uri + '?eventid=' + eventId, {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  });

  const response = (await resp.json()) as EF_Tickets_Response;

  const fieldSet: Fieldset | undefined = response[
    'prj-cockpitv3_tickets_combined'].fieldsets.find(fs => fs.name === 'prj-cockpitv3_tickets_text');

  const conditions: Field | undefined = fieldSet?.fields.find(
    (f) => f.name === 'conditions'
  );
  const logotext: Field | undefined = fieldSet?.fields.find(
    (f) => f.name === 'logotext'
  );

  return {
    conditions: conditions?.value ?? '',
    logotext: logotext?.value ?? ''
  };
}
