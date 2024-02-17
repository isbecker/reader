import type { SocialPost } from '$lib/hf/schemas/SocialPostSchema';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, fetch, params }) => {

  const { slug } = params;
  const { user } = params;

  const url = `/api/hf/posts/${user}/${slug}`

  const hnJson = await fetch(url).then(async (res) => await res.json())
    .catch((err) => console.log(err));

  return { post: hnJson as SocialPost }
}