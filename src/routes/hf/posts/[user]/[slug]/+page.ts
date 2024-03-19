import type { SocialPost } from '$lib/types/hf/schemas/SocialPostSchema';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params }) => {

  const { slug } = params;
  const { user } = params;

  const url = `/api/hf/posts/${user}/${slug}`

  const hfJson: Promise<SocialPost> = fetch(url).then(async (res) => await res.json())
    .catch((err) => console.log(err));

  return { post: hfJson }
}