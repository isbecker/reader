import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ request, fetch }) => {
  const url = new URL(request.url).searchParams.get('url');
  
  if (!url) {
    return new Response(
      JSON.stringify({ error: 'URL parameter is required' }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }

  const encodedUrl = encodeURIComponent(url);
  const response = await fetch(
    `https://web.archive.org/cdx/search/cdx?url=${encodedUrl}&matchType=exact&output=json&limit=30&&fl=timestamp,length,original&filter=mimetype:text/html&filter=statuscode:200&collapse=timestamp:10`
  );

  let jsonResp = await response.json();

  jsonResp = jsonResp
    .slice(1)
    .map((row: any) => {
      return {
        timestamp: row[0],
        length: row[1],
        url: `https://web.archive.org/web/${row[0]}/${url}`,
        original: row[2]
      };
    })
    .sort((a: any, b: any) => {
      return b.length - a.length;
    });

  return json(jsonResp);
};
