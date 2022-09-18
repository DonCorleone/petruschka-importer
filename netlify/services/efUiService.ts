import fetch, { HeadersInit } from 'node-fetch';
import { EF_Event_Ui, EF_Event_Ui_Response } from '../models/EF_Event_UI';
import { Event_Ui_Props } from '../models/Event_Ui_Props';
import { EmblemToShow, EventInfo, TicketType } from '../models/EF_Event_Detail';

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

  const resp = await fetch(uri + '&eventid=' + eventId, {
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
  emblemToShow: EmblemToShow | undefined,
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
      flyerImagePath: emblemToShow?.url ?? '',
      shortDescription: eventUi.shortDesc ?? '',
      longDescription:
        eventUi.description?.substring(
          0,
          eventUi.description.indexOf('<p><strong>Mitwirkende')
        ) ?? '',
      bannerImagePath: emblemToShow?.url ?? '',
      url: url ?? ''
    }
  ];
}

export function getTicketTypes(
  emblemToShow: EmblemToShow | undefined
): TicketType[] {
  return [
    {
      sortOrder: 0,
      ticketTypeInfos: [
        {
          languageId: 0,
          imageUrl: emblemToShow?.url ?? '',
          name: 'Erwachsene'
        },
        {
          languageId: 0,
          imageUrl: emblemToShow?.url ?? '',
          name: 'Kinder'
        }
      ]
    }
  ];
}
