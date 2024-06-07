import type Readable from "$lib/types/Reabable";
import { parseReadable } from "$lib/types/Reabable";
import type Story from "$lib/types/hn/Story";
import { parseStory } from "$lib/types/hn/Story";

export async function load({ fetch, params }) {
  const { id } = params;

  const story: Story = await fetch(`/api/hn/item/${id}`)
    .then((res) => res.json())
    .then((story) => parseStory(story))


  const readable: Readable = await fetch(`/api/content/readable?url=${story.url}`)
    .then((res) => res.json())
    .then(parseReadable);

  return { story, readable }
}