import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, fetch, locals }) => {
  const summaryRequest: { content: string } = await request.json();

  const response = await fetch('https://summarizer.beckr.dev', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + locals.user.jwt
    },
    body: JSON.stringify(summaryRequest)
  });

  const jsonResp = await response.json();

  return json(jsonResp);
};