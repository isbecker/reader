// import { createQuery } from "@tanstack/svelte-query";
// import { parseStory } from "../../../types/hn/Story";
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, fetch, params }) => {

  const { queryClient } = await parent()
  const { stories } = params; // top, hot, new, best, ask, show, job

  const fetchStories = async () => {
    return await fetch(`/api/hn/${stories}`)
      .then(async (res) => await res.json())
      .then(async (ids) => {
        return ids.slice(0, 30)
      })
      // .then(async (top) =>
      //   await Promise.all(top.slice(0, 30)
      //     .map(async (story: number) => {
      //       return await fetch(`/api/hn/post/${story}`)
      //         .then((res) => res.json())
      //         .then((story) => parseStory(story));
      //     })
      //   )
      // )
  }

  await queryClient.prefetchQuery({
    queryKey: ['hn', stories],
    queryFn: fetchStories,
  });

  return {
    kind: stories,
    stories: await fetchStories()
  };
}