import type { SocialPostsData } from '$lib/types/hf/PostParser';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
  const hfJson: Promise<SocialPostsData> = fetch(`/api/hf/posts`)
    .then(async (res) => await res.json())
    .catch((err) => console.log(err));

  return {
    posts: hfJson 
  };
}