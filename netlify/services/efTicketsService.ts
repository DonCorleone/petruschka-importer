import fetch, { HeadersInit } from 'node-fetch';
import { EF_Tickets_Response, Field, Fieldset } from '../models/EF_Tickets';
import { Category } from '../models/EF_Event_Categories';
import { getUnpackedSettings } from 'http2';

export interface EF_Ticket_Info {
  conditions?: string;
  logotext: string;
}

export default async function getTickets(
  eventId: string
): Promise<EF_Ticket_Info> {
  const auth = 
  process.env.EF_AUTH;
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

  const response = (await resp?.size > 0 ? resp.json(): {}) as EF_Tickets_Response;

  const fieldSet: Fieldset | undefined = response ? response[
    'prj-cockpitv3_tickets_combined'
  ]?.fieldsets?.find((fs) => fs.name === 'prj-cockpitv3_tickets_text') : undefined;

  const conditions: Field | undefined = fieldSet?.fields.find(
    (f) => f.name === 'conditions'
  );
  const logotext: Field | undefined = fieldSet?.fields.find(
    (f) => f.name === 'logotext'
  );

  return {
    conditions: conditions?.value ?? undefined,
    logotext: logotext?.value ?? ''
  };
}

export function getCategoriesFromTicket(
  ticketConditions?: string
): Category[] {
  const regexp = /(Erwachsene|Kinder): CHF (\d+(?:\.\d{1,2})?)/g;

  const categoryStrings = ticketConditions?.match(regexp);

  let categories: Category[] = [];
  if (categoryStrings?.length) {
    categoryStrings.map((p) => {
      const price = getPriceFromCategory(p);
      categories.push({
        title: p
          .substring(0, p.indexOf(price))
          .replace('CHF', '')
          .replace(':', '')
          .trim(),
        priceStrategy: {
          highestPrice: +price
        }
      });
    });
  }
  return categories;
}

function getPriceFromCategory(category: string): string {
  const regexp = /(\d+(?:\.\d{1,2})?)/g;

  const prices = category.match(regexp);

  if (prices?.length) {
    return prices[0];
  }
  return '';
}
