import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ request, fetch }) => {
  const url = new URL(request.url).searchParams.get('url')
  if (!url) {
    return new Response(JSON.stringify({ error: 'URL parameter is required' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }


  const encodedUrl = encodeURIComponent(url)

  const response = await fetch(`/api/content/archive?url=${encodedUrl}`)
  const jsonResp = await response.json()

  const readable = await fetch(`/api/content/readable?url=${jsonResp[0].url}`)
  const readableJson = await readable.json()

  return json(readableJson)
}
