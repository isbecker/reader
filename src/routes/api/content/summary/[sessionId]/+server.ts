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
        redirect(307, '/auth/login');
      } else {
        response.headers.getSetCookie().forEach((cookieString) => {
          const cookieAttributes = cookieString.split(';').map(attr => attr.trim());
          const cookie = parse(cookieAttributes.shift() || ""); // The first part is the cookie name=value

          let expires: string | undefined = undefined;
          let maxAge: number | undefined = undefined;
          let path: string | undefined = undefined;
          let domain: string | undefined = undefined;
          let sameSite: 'Lax' | 'Strict' | 'None' | undefined = undefined;

          cookieAttributes.forEach(attr => {
            const [key, value] = attr.split('=');

            // Checking and extracting the Expires attribute
            if (key === 'Expires') {
              expires = value;
            } else if (key === 'Max-Age') {
              maxAge = parseInt(value);
            } else if (key === 'Path') {
              path = value;
            } else if (key === 'Domain') {
              domain = value;
            } else if (key === 'SameSite') {
              sameSite = value as 'Lax' | 'Strict' | 'None';
            }
          });

          if (cookie['AccessToken']) {
            const jwt = cookie['AccessToken'];
            cookies.set('AccessToken', jwt,
              {
                path: path || '/',
                expires: expires ? new Date(expires) : undefined,
                maxAge: maxAge,
                domain: domain,
                secure: true,
                httpOnly: true,
                sameSite: sameSite
              });
            locals.user.jwt = jwt;
          }
          if (cookie['RefreshToken']) {
            const refresh = cookie['RefreshToken'];
            cookies.set('RefreshToken', refresh,
              {
                path: path || '/',
                expires: expires,
                maxAge: maxAge,
                domain: domain,
                secure: true,
                httpOnly: true,
                sameSite: sameSite
              });
            locals.user.refresh = refresh;
          }
        });
      }
    }
  }
  try {
    const response = await fetch('https://summarizer.beckr.dev', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${locals.user.jwt}`
      },
      body: JSON.stringify(summaryRequest)
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Clear the session and redirect to login
        await kv.del(sessionId);
        redirect(307, '/auth/login');
      }
      throw new Error(`Failed to connect: ${response.statusText}`);
    }

    await kv.del(sessionId);

    // Check the response type
    // If it is a JSON response, parse it and return it
    const contentType = response.headers.get('Content-Type');
    if (contentType && contentType.includes('application/json')) {
      // transform the json into an event stream
      const json = await response.json();
      const headers = new Headers({
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      });
      const encoder = new TextEncoder();
      const stream = new TransformStream();
      const writable = stream.writable;
      const writer = writable.getWriter();
      const response = new Response(stream.readable, { headers });
      writer.write(encoder.encode(`event: reduceStep\n` + `data: ${JSON.stringify(json)}\n\n`));
      writer.close();
      return response;
    }
    else if (contentType && contentType.includes('text/event-stream')) {
      return new Response(response.body, {
        status: 200,
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }
    else {
      return new Response(await response.text(), {
        status: 200,
        headers: {
          'Content-Type': contentType || 'text/plain'
        }
      });
    }
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