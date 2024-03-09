import type { Handle } from '@sveltejs/kit';
import { parse } from 'cookie';

export const handle: Handle = async ({ event, resolve }) => {

  if (import.meta.env.DEV) {
    const mockJwt = import.meta.env.MOCK_JWT;
    const mockRefresh = import.meta.env.MOCK_REFRESH_TOKEN;

    event.locals.user = {
      jwt: mockJwt,
      refresh: mockRefresh
    };

    return resolve(event);
  }


  const httpCookie = parse(event.request.headers.get("Cookie") || "");
  const jwt = httpCookie["AccessToken"] ?? null;
  const refresh = httpCookie["RefreshToken"] ?? null;


  if (jwt) {
    event.locals.user.jwt = jwt
  }
  if (refresh) {
    event.locals.user.refresh = refresh
  }

  return resolve(event);
}