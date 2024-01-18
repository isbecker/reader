import type Comment from "../../../../types/hn/Comment";
import { parseComment } from "../../../../types/hn/Comment";
import type Story from "../../../../types/hn/Story";
import { parseStory } from "../../../../types/hn/Story";

export async function load({ fetch, params }) {
  const { id } = params;

  const story = await fetch(`/api/hn/post/${id}`)
    .then((res) => res.json())
    .then((story) => parseStory(story))
    .then(async (story) => {
      story.comments = await loadComments(story, fetch);
      return story;
    })

  return { story }
}

async function loadComments(story: Story, fetch: {
  (input: URL | RequestInfo, init?: RequestInit | undefined): Promise<Response>;
  (input: string | URL | Request, init?: RequestInit | undefined): Promise<Response>;
}): Promise<Comment[] | undefined> {

  if (!story.kids) return undefined;

  const comments = await Promise.all(story.kids.map(async (id) => {
    const response = await fetch(`/api/hn/post/${id}`);
    const commentRes = await response.json();
    const comment = parseComment(commentRes);
    comment.children = await loadChildren(comment, fetch);
    return comment
  }));

  return comments;
}


async function loadChildren(comment: Comment,
  fetch: {
    (input: URL | RequestInfo, init?: RequestInit | undefined): Promise<Response>;
    (input: string | URL | Request, init?: RequestInit | undefined): Promise<Response>;
  }): Promise<Comment[] | undefined> {
  if (!comment.kids) return undefined;

  const comments = await Promise.all(comment.kids.map(async (id) => {
    const response = await fetch(`/api/hn/post/${id}`);
    const commentRes = await response.json();

    const child = parseComment(commentRes, comment.root ?? comment.id);
    child.children = await loadChildren(child, fetch);

    return child
  }));

  return comments;
}