import { parseStory } from "../../../types/hn/Story";

export async function load({ fetch, params }) {

  const { stories } = params; // top, hot, new, best, ask, show, job

  const top = await fetch(`/api/hn/${stories}`).then(async (res) => await res.json());

  const storyList = await Promise.all(
    top.slice(0, 30).map(async (story: number) => {
      return await fetch(`/api/hn/post/${story}`)
        .then((res) => res.json())
        .then((story) => parseStory(story));
    }),
  );

  return {
    storyList
  };  
}