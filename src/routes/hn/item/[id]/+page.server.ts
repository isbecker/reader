import { parseStory } from "../../../../types/hn/Story";

export async function load({ fetch, params }) {
  const { id } = params;

  const story = await fetch(`/api/hn/post/${id}`)
    .then((res) => res.json())
    .then((story) => parseStory(story));

  return { story }
}