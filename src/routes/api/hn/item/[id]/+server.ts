import type { Config } from '@sveltejs/adapter-vercel';
import {Item, Comment} from '$lib/types/hn/item';
import { json, type RequestHandler } from '@sveltejs/kit';

export const config: Config = {
  runtime: 'edge',
};

export const GET: RequestHandler = async ({ params, fetch, url }) => {
    const { id } = params;
    const deep = url.searchParams.get('deep') ?? 'false';

    const itemId = parseInt(id as string);

    let item: Item;
    if (deep === 'true') {
      item = await fetchItemFull(itemId, fetch);
    } else {
      item = await fetchItem(itemId, fetch);
    }
    
    return json(item,
        {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'max-age=10, public, s-maxage=10, stale-while-revalidate=10, stale-if-error=10',
                'CDN-Cache-Control': 'max-age=60, public, s-maxage=60, stale-while-revalidate=60, stale-if-error=60',
                'Vercel-CDN-Cache-Control': 'max-age=3600, public, s-maxage=3600, stale-while-revalidate=3600, stale-if-error=3600',
            }
        });
}

async function fetchItem(id: number, customFetch = fetch): Promise<Item> {
  const response = await customFetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
  const data = await response.json();

  return Item.createFromOfficial(data);
}

async function fetchItemFull(id: number, customFetch = fetch): Promise<Item> {
  const item = await fetchItem(id, customFetch);

  if (item.kids) {
    const kids = await Promise.all(item.kids.map(async (id: number) => await fetchItemFull(id, customFetch) as Comment));
    item.comments = kids;
  }

  return item;
}