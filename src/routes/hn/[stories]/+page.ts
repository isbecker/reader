// import { createQuery } from "@tanstack/svelte-query";
// import { parseStory } from "../../../types/hn/Story";
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, fetch, params }) => {

  const { queryClient } = await parent()
  const { stories } = params; // top, hot, new, best, ask, show, job

  const fetchStories = async () => {
    const response = await fetch(`/api/hn/${stories}`);
    const ids = await response.json();
    return ids;
  }

  await queryClient.prefetchQuery({
    queryKey: ['hn', "stories", stories],
    queryFn: fetchStories,
  });

  return {
    kind: stories,
  };
}