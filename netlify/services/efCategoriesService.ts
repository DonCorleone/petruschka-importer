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

  const myHeaders: HeadersInit = {
    Authorization: auth,
    Cookie: cookie,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  const resp = await fetch(uri + eventId + '/categories', {
    method: 'GET',
    headers: myHeaders
  });

  // Log the response body and headers
  console.log(await resp.text());
  console.log(resp.headers.raw());

  if (!resp.ok) {
    return [];
  }

  const response = (await resp.json()) as EF_Categories_Response;

  const list: Category[] | unknown = response.categories;

  const efEventCategories = list as Category[];

  if (!efEventCategories || !efEventCategories.length) {
    throw new Error('no EventOverviews found on EF');
  }

  return efEventCategories;
}
