import fetch, { HeadersInit } from 'node-fetch';
import {
  Category,
  EF_Categories_Response
} from '../models/EF_Event_Categories';

export default async function getEventCategories(
  eventId: string
): Promise<Category[]> {
  const auth = process.env.EF_AUTH;
  const cookie = process.env.EF_COOKIE;
  const uri = process.env.EF_URL_CATEGORIES;

  if (!auth || !cookie || !uri) {
    throw new Error('no ef uri or no auth');
  }

  const url = uri + eventId + '/categories';

  const myHeaders = {
    Authorization: auth,
    Cookie: cookie,
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:125.0) Gecko/20100101 Firefox/125.0",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Language": "en,de;q=0.7,en-US;q=0.3",
      "Upgrade-Insecure-Requests": "1",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
      "Sec-Fetch-User": "?1"
  };
  
  const resp = await fetch(url, {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
  });
  
  if (!resp.ok) {
      return [];
  }

  const response = (await resp.json()) as EF_Categories_Response;

  const list: Category[] | unknown = response.data;

  const efEventCategories = list as Category[];

  if (!efEventCategories || !efEventCategories.length) {
    return []; //throw new Error('no EventOverviews found on EF');
  }

  return efEventCategories;
}
