import PostParser from '$lib/hf/PostParser';
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ request, fetch }) => {
  const skip = new URL(request.url).searchParams.get('skip') ?? 0
  const sort = new URL(request.url).searchParams.get('sort') ?? 'recent'

  const hfJson = await fetch(`https://huggingface.co/api/posts?skip=${skip}&sort=${sort}`)
    .then(async (res) => await res.json())
    .catch((err) => console.log(err));

  const hf = PostParser.safeParseSocialPosts(hfJson);

  if (!hf.success) {
    return json({ error: hf.error });
  } else if (!hf.data) {
    return json({ error: 'No data' });
  } else {
    return json(hf.data);
  }
}