
import fetch, { HeadersInit } from 'node-fetch';
import {
    EF_Event_Ui,
    EF_Event_Ui_Response
} from '../models/EF_Event_UI';

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
    const efEventUiResponse: EF_Event_Ui | unknown = response["prj-cockpitv3_event_general"];

    const efEventUi = efEventUiResponse as EF_Event_Ui;
    if (!efEventUi) {
        throw new Error('no EventUi found on EF');
    }
    return efEventUi;
}
