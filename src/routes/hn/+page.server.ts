import { parseStory } from "../../types/hn/Story";

export async function load({ fetch }) {

  const top = await fetch("/api/hn/top").then(async (res) => await res.json());

  const stories = await Promise.all(
    top.slice(0, 30).map(async (story: number) => {
      return await fetch(`/api/hn/post/${story}`)
        .then((res) => res.json())
        .then((story) => parseStory(story));
    }),
  );

  return {
    stories
  };
}