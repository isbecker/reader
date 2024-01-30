import moment from 'moment';
import { parsePost } from '../../../../../../types/reddit/Post';




export async function load({ fetch, params }) {
  const { name, id, title } = params;
  return { 
    post: await fetchComments(name, id, title, fetch).then(parsePost) 
  }
}

async function fetchComments(subreddit: string, id: string, title: string,
  fetch: {
    (input: URL | RequestInfo, init?: RequestInit | undefined): Promise<Response>;
    (input: string | URL | Request, init?: RequestInit | undefined): Promise<any>;
  }): Promise<any> {
  const maxRetries = 3;
  let retryCount = 0;

  const url = `https://corsproxy.io/?${`https://old.reddit.com/r/${subreddit}/comments/${id}/${title}.json?t=${moment().unix()}`}`
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
