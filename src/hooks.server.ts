import type { Handle } from '@sveltejs/kit';
import { parse } from 'cookie';

export const handle: Handle = async ({ event, resolve }) => {

  const httpCookie = parse(event.request.headers.get("Cookie") || "");
  const jwt = httpCookie["AccessToken"] ?? null;
  const refresh = httpCookie["RefreshToken"] ?? null;


  if (jwt && refresh) {
    event.locals.user = { jwt, refresh };
  }

  return resolve(event);
}