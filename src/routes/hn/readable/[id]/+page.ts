import type Readable from "../../../../types/Reabable";
import { parseReadable } from "../../../../types/Reabable";
import type Story from "../../../../types/hn/Story";
import { parseStory } from "../../../../types/hn/Story";

export async function load({ fetch, params }) {
  const { id } = params;

  const story: Story = await fetch(`/api/hn/post/${id}`)
    .then((res) => res.json())
    .then((story) => parseStory(story))


  const readable: Readable = await fetch(`/api/content/readable?url=${story.url}`)
    .then((res) => res.json())
    .then(parseReadable);

  return { story, readable }
}