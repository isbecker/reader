import type { Config } from '@sveltejs/adapter-vercel';
import { redirect, type RequestHandler } from '@sveltejs/kit';
import { kv } from "@vercel/kv";
import { parse } from 'cookie';

export const config: Config = {
  runtime: 'edge',
};

export const GET: RequestHandler = async ({ params, fetch, locals, cookies }) => {
  const { sessionId } = params;
  if (!sessionId || !await kv.exists(sessionId)) {
    // Handle missing or invalid sessionId...
    return new Response('Session not found', { status: 404 });
  }

  const summaryRequest = await kv.get(sessionId);
  if (!locals.user.jwt) {
    if (locals.user.refresh) {
      // Refresh the token
      const response = await fetch('https://auth.beckr.dev/auth/refresh', {
        headers: {
          'Authorization': 'Bearer ' + locals.user.refresh
        },
      });
      if (!response.ok) {
        throw redirect(307, '/auth/login');
      } else {
        response.headers.getSetCookie().forEach((cookie) => {
          if (cookie.startsWith('AccessToken')) {
            const jwt = parse(cookie)['AccessToken'];
            cookies.set('AccessToken', jwt);
            locals.user.jwt = jwt;
          }
          if (cookie.startsWith('RefreshToken')) {
            const refresh = parse(cookie)['RefreshToken'];
            cookies.set('RefreshToken', refresh);
            locals.user.refresh = refresh;
          }
        });
      }
    }

    return new Response('Unauthorized', { status: 401 });
  }
  try {
    const response = await fetch('https://summarizer.beckr.dev', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + locals.user.jwt
      },
      body: JSON.stringify(summaryRequest)
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Clear the session and redirect to login
        await kv.del(sessionId);
        throw redirect(307, '/auth/login');
      }
      throw new Error(`Failed to connect: ${response.statusText}`);
    }

    await kv.del(sessionId);

    // Stream the response back to the client
    return new Response(response.body, {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    return new Response(JSON.stringify({ error: 'Unknown error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};