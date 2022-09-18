import fetch, { HeadersInit } from 'node-fetch';
import { EF_Location_Respose } from '../models/EF_Location';

export default async function getLocationsById(
  locationId: string
): Promise<EF_Location_Respose> {
  const auth = process.env.EF_AUTH;
  const cookie = process.env.EF_COOKIE;
  const uri = process.env.EF_URL_LOCATION;

  if (!auth || !cookie || !uri) {
    throw new Error('no ef uri or no auth');
  }

  const myHeaders: HeadersInit = {
    Authorization: auth,
    Cookie: cookie
  };

  const resp = await fetch(`${uri}/${locationId}.de.json`, {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  });

  const response = (await resp.json()) as EF_Location_Respose;

  if (!response) {
    throw new Error('location not found on EF');
  }

  return response;
}
