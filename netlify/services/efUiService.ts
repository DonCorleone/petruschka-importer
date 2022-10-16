import fetch, { HeadersInit } from 'node-fetch';
import { EF_Event_Ui, EF_Event_Ui_Response } from '../models/EF_Event_UI';
import { Event_Ui_Props } from '../models/Event_Ui_Props';
import { EventInfo, TicketType } from '../models/EF_Event_Detail';
import { EF_Ticket_Info } from './efTicketsService';
import { Category } from '../models/EF_Event_Categories';
import { Double } from 'mongodb';

export default async function getEvents(eventId: string): Promise<EF_Event_Ui> {
  const auth = process.env.EF_AUTH;
  const cookie = process.env.EF_COOKIE;
  const uri = process.env.EF_URL_EVENT_UI;

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

  const response = (await resp.json()) as EF_Event_Ui_Response;
  const efEventUiResponse: EF_Event_Ui | unknown =
    response['prj-cockpitv3_event_general'];

  const efEventUi = efEventUiResponse as EF_Event_Ui;
  if (!efEventUi) {
    throw new Error('no EventUi found on EF');
  }
  return efEventUi;
}

export function getPropertiesFromJson(eventUi: EF_Event_Ui): Event_Ui_Props {
  return {
    title: eventUi.fieldsets
      .find((p) => p.name == 'prj-cockpitv3_event_general')
      ?.fields.find((f) => f.name == 'eventBasic_title')?.value,
    shortDesc: eventUi.fieldsets
      .find((p) => p.name == 'descriptionForm')
      ?.fields.find((f) => f.name == 'eventBasic_shortDescription')?.value,
    description: eventUi.fieldsets
      .find((p) => p.name == 'descriptionForm')
      ?.fields.find((f) => f.name == 'eventBasic_description')?.value
  };
}

export function getArtistsFromDesc(description: string): string {
  const regexpArtists = /<p><strong>Mitwirkende<\/strong><\/p>([\s\S])*<\/ul>/g;
  const artists = description.match(regexpArtists);

  if (!artists || artists.length == 0) {
    return '';
  }

  const regexpLi = /(<[o|u]l>)?(<li>(?<value>.+?)<\/li>)+?(<\/[o|u]l>)*/g;
  const matches = artists[0].match(regexpLi);

  if (!matches) {
    return '';
  }

  return matches.map((x) => x.replace(/<\/?li>/g, '')).join(' | ');
}

export function getMetaInfoFromDesc(
  description: string,
  regExp: RegExp
): string {
  const metaInfo = description.match(regExp);
  return metaInfo && metaInfo.length > 1 ? metaInfo[1] : '';
}

export function getEventInfos(
  eventUi: Event_Ui_Props,
  eventKey: string,
  url: string | undefined,
  artists: string | undefined,
  location: string | undefined
): EventInfo[] {
  return [
    {
      name: eventUi.title ?? 'ToDo',
      languageId: 0,
      importantNotes: '',
      artists: artists,
      location: location,
      flyerImagePath: `https://petruschka.netlify.app/assets/images/main/portrait/${eventKey}.jpg` ,
      shortDescription: eventUi.shortDesc ?? '',
      longDescription:
        eventUi.description?.substring(
          0,
          eventUi.description.indexOf('<p><strong>Mitwirkende')
        ) ?? '',
      bannerImagePath: `https://petruschka.netlify.app/assets/images/main/landscape/${eventKey}.jpg`,
      url: url ?? ''
    }
  ];
}

export function getTicketTypes(
  visibility: string | undefined,
  categories: Category[],
  ticket: EF_Ticket_Info,
  eventKey: string,
  presaleInfo: string
): TicketType[] {
  const ticketTypes: TicketType[] = [];

  categories.forEach((cat, ix) => {
    ticketTypes.push({
      ticketTypeInfos: [
        {
          languageId: 0,
          imageUrl: ticket?.logotext
            ? `/assets/images/${ticket.logotext}/${ticket.logotext}_${eventKey}`
            : '',
          description: ticket?.conditions ?? presaleInfo,
          name: cat.title
        }
      ],
      sortOrder: ix,
      preSaleStart: visibility ? new Date(visibility) : new Date(),
      price: new Double(cat.priceStrategy.highestPrice),
      currency: 'CHF'
    });
  });
  return ticketTypes;
}
