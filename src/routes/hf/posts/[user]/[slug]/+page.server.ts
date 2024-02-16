import { JSDOM } from 'jsdom';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, fetch, params }) => {

  const { slug } = params;
  const { user } = params;

  const url = `https://corsproxy.io/?${encodeURIComponent(`https://huggingface.co/posts/${user}/${slug}`)}`
  try {
    // Fetch the HTML content of the page
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch page: ${response.statusText}`);
    }
    const html = await response.text();

    // Use JSDOM to parse the HTML content
    const dom = new JSDOM(html);
    const document = dom.window.document;

    // Find the element with the class 'SVELTE_HYDRATER' and data-target='SocialPost'
    const element = document.querySelector('.SVELTE_HYDRATER[data-target="SocialPost"]');

    if (element) {

      // Access the 'data-props' attribute
      const dataProps = element.getAttribute('data-props');
      if (dataProps) {
        // Decode the JSON-encoded 'data-props' attribute
        const decodedProps = JSON.parse(dataProps);

        // Now you can use decodedProps as a JavaScript object
        return { post: decodedProps.socialPost };
      }
    } else {
      console.log('Element not found.');
      return { post: { error: 'Element not found.' } };
    }
  } catch (error) {
    console.error('Error:', error);
    return { post: { error: (error as Error).message } };
  }
}