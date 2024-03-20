import PostParser from '$lib/types/hf/PostParser';
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ fetch, url }) => {
  const skip = url.searchParams.get('skip') ?? 0
  const sort = url.searchParams.get('sort') ?? 'recent'

  const hfJson = await fetch(`https://huggingface.co/api/posts?skip=${skip}&sort=${sort}`)
    .then(async (res) => await res.json())
    .catch((err) => console.log(err));

  const hf = PostParser.safeParseSocialPosts(hfJson);

  if (!hf.success) {
    return json({ error: hf.error });
  } else if (!hf.data) {
    return json({ error: 'No data' });
  } else {
    return json(hf.data, {
      headers: {
        'Cache-Control': 'max-age=10, public, s-maxage=10, stale-while-revalidate=10, stale-if-error=10',
        'CDN-Cache-Control': 'max-age=60, public, s-maxage=60, stale-while-revalidate=60, stale-if-error=60',
        'Vercel-CDN-Cache-Control': 'max-age=3600, public, s-maxage=3600, stale-while-revalidate=3600, stale-if-error=3600',
      }
    });
  }
}