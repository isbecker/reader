import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ fetch }) => {

  const hnJson = await fetch('https://hacker-news.firebaseio.com/v0/askstories.json')
    .then(async (res) => await res.json())
    .catch((err) => console.log(err));

  return new Response(JSON.stringify(hnJson), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'max-age=10, public, s-maxage=10, stale-while-revalidate=10, stale-if-error=10',
      'CDN-Cache-Control': 'max-age=60, public, s-maxage=60, stale-while-revalidate=60, stale-if-error=60',
      'Vercel-CDN-Cache-Control': 'max-age=3600, public, s-maxage=3600, stale-while-revalidate=3600, stale-if-error=3600',
    }
  });
}