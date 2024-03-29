import type Comment from "./Comment";

export default interface Story {
  id: number,
  author: string, // 'by' in the HN API
  descendants: number, // otherwise known as num_comments
  kids?: number[], // in the HN API, this is an array of comment IDs
  score: number,
  time: number,
  title: string,
  text?: string,
  type: string, // "story" | "job"
  url: string,
  domain: string,
  comments?: Comment[]
}

export function parseStory(story: any): Story {
  const s: Story = {
    id: story.id,
    author: story.by,
    descendants: story.descendants,
    kids: story.kids,
    score: story.score,
    time: story.time,
    title: story.title,
    text: story.text || undefined,
    type: story.type,
    url: story.url,
    // get domain from the url
    domain: story.url ? new URL(story.url).hostname : ""
  }

  return s;
}