import type { Handle } from '@sveltejs/kit';

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

  

  const jwt = event.cookies.get("AccessToken") ?? null;
  const refresh = event.cookies.get("RefreshToken") ?? null;


  event.locals.user = { jwt, refresh };

  return resolve(event);
}