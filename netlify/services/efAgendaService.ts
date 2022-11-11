import fetch, { HeadersInit } from 'node-fetch';
import { EF_Event_Agenda_Response } from '../models/EF_Event_Agenda';
import { EF_Event_Ui } from '../models/EF_Event_UI';
import { Event_Agenda_Props } from '../models/Event_Agenda_Props';

export default async function getEventAgenda(
  eventId: string
): Promise<EF_Event_Ui> {
  const auth = process.env.EF_AUTH;
  const cookie = process.env.EF_COOKIE;
  const uri =
    'https://eventfrog.ch/api/cms/forms/prj-cockpitv3_event_agendainfo.de.json?subFormsAsForms=false&displaySubmitButton=false&eventId=';

  if (!auth || !cookie || !uri) {
    throw new Error('no ef uri or no auth');
  }

  const myHeaders: HeadersInit = {
    Authorization: auth,
    Cookie: cookie
  };

  const resp = await fetch(uri + eventId, {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  });

  const response = (await resp.json()) as EF_Event_Agenda_Response;
  const efEventUiResponse: EF_Event_Ui | unknown =
    response['prj-cockpitv3_event_agendainfo'];

  const efEventUi = efEventUiResponse as EF_Event_Ui;
  if (!efEventUi) {
    throw new Error('no EventUi found on EF');
  }
  return efEventUi;
}

export function getAgendaFromJson(
  eventAgenda: EF_Event_Ui
): Event_Agenda_Props {
  return {
    text: eventAgenda.fieldsets
      .find((p) => p.name == 'prj-cockpitv3_event_agendainfo')
      ?.fields.find((f) => f.name == 'text')?.value,
    link: eventAgenda.fieldsets
      .find((p) => p.name == 'prj-cockpitv3_event_agendainfo')
      ?.fields.find((f) => f.name == 'link')?.value
  };
}
