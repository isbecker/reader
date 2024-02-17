import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { JSDOM } from 'jsdom';

import PostParser from '$lib/hf/PostParser';

export const GET: RequestHandler = async ({ request, fetch, params }) => {
  const { slug } = params;
  const { user } = params;

  const url = `https://huggingface.co/posts/${user}/${slug}`

  const hfhtml = await fetch(url)
    .then(async (res) => await res.text())

  const dom = new JSDOM(hfhtml);
  const document = dom.window.document;

  // Find the element with the class 'SVELTE_HYDRATER' and data-target='SocialPost'
  const element = document.querySelector('.SVELTE_HYDRATER[data-target="SocialPost"]');

  if (element) {

    // Access the 'data-props' attribute
    const dataProps = element.getAttribute('data-props');
    if (dataProps) {
      // Decode the JSON-encoded 'data-props' attribute
      const decodedProps = JSON.parse(dataProps);

      const socialPost = PostParser.safeParseSocialPost(decodedProps.socialPost);

      if (!socialPost.success) {
        return json({ error: socialPost.error });
      } else if (!socialPost.data) {
        return json({ error: 'No data' });
      } else {
        return json(socialPost.data);

      }
    }
  }

  return json({ error: 'Element not found.' });
}


