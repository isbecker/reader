import moment from 'moment';
import { parseReadable } from '$lib/types/Reabable.js';
import type Post from '$lib/types/reddit/Post.js';
import { parsePost } from '$lib/types/reddit/Post.js';

export async function load({ fetch, params }) {
  const { name, id, title } = params;

  const maxRetries = 3;
  let retryCount = 0;

  const url = `https://corsproxy.io/?${`https://old.reddit.com/r/${name}/comments/${id}/${title}.json?t=${moment().unix()}`}`
  while (retryCount < maxRetries) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        const post: Post = await response.json().then(parsePost)
        const readable = await fetch(`/api/content/readable?url=${post.url}`)
          .then(async (res) => await res.json())
          .then(parseReadable);


        return { 
          post: post,
          readable: readable
        };
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
