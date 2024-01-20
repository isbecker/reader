import moment from 'moment';
import { parseComment } from '../../../../../types/reddit/Comment';
// import type Post from '../../../../../types/reddit/Post';
// import { parsePost } from '../../../../../types/reddit/Post';




export async function load({ fetch, params }) {
  const { name, id } = params;

  const post = await fetchComments(name, id, fetch)
  const op = parseComment(post[0].data.children[0].data)
  const comments = post[1].data.children.map((c) => parseComment(c.data))

  return { op, comments }
}

async function fetchComments(subreddit: string, id: string,
  fetch: {
    (input: URL | RequestInfo, init?: RequestInit | undefined): Promise<Response>;
    (input: string | URL | Request, init?: RequestInit | undefined): Promise<any>;
  }): Promise<any> {
  const maxRetries = 3;
  let retryCount = 0;

  const url = `https://corsproxy.io/?${encodeURIComponent(`https://www.reddit.com/r/${subreddit}/${id}.json?t=${moment().unix()}`)}`
  // const url = `/api/reddit/${subreddit}/comments/${id}`
  // console.log(url)
  while (retryCount < maxRetries) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return await response.json();
      } else {
        throw new Error("Failed to fetch");
      }
    } catch (error) {
      console.error("Error:", error);
      retryCount++;
    }
  }

  return null;
}
