import type { SocialPost } from '$lib/types/hf/schemas/SocialPostSchema';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, fetch, params }) => {
  const { queryClient } = await parent()

  const { slug } = params;
  const { user } = params;

  const url = `/api/hf/posts/${user}/${slug}`

  const fetchPost = async (): Promise<SocialPost> => {
    const hf = await fetch(url);
    const hfJson = await hf.json();
    return hfJson;
  }
  queryClient.prefetchQuery({
    queryKey: ['hf', 'posts', user, slug],
    queryFn: fetchPost
  });
  
  return { slug, user }
}