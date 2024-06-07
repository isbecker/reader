import type Comment from "$lib/types/hn/Comment";
import { parsePwaComment } from "$lib/types/hn/Comment";

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
    author: story.author,
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

export function parsePwaStory(story: any): Story {
  const s: Story = {
    id: story.id,
    author: story.user,
    descendants: story.comments_count,
    kids: story.comments?.map((c: any) => c.id),
    score: story.points,
    time: story.time,
    title: story.title,
    text: story.content || undefined,
    type: story.type,
    url: story.url,
    domain: story.domain,
    comments: story.comments?.map((c: any) => parsePwaComment(c))
  }

  return s;
}