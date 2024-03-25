import { Comment, Item } from '$lib/types/hn/item';
import type { Config } from '@sveltejs/adapter-vercel';
import { json, redirect, type RequestHandler } from '@sveltejs/kit';

export const config: Config = {
  runtime: 'edge',
};

export const GET: RequestHandler = async ({ params, fetch, url }) => {
  const { id } = params;
  const deep = url.searchParams.get('deep') ?? 'false';

  const itemId = parseInt(id as string);

  const maxItems = 1500;
  let item: Item = await fetchItem(itemId, fetch);
  if ((item.descendants ?? 0) > maxItems) {
    redirect(307, `/api/hnpwa/item/${id}`);
  }

  if (deep === 'true') {
    item = await fetchItemFull(item, fetch);
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

async function fetchItemFull(item: Item, customFetch = fetch): Promise<Item> {
  const kids = item.kids ? await Promise.all(item.kids.map(async (kid) => {
    const child = await fetchItem(kid, customFetch) as Comment;
    child.root = (item as Comment).root ?? (item.type === 'comment' ? item.id : undefined);
    return await fetchItemFull(child, customFetch) as Comment;
  })) : [];
  item.comments = kids as Comment[];

  return item;
}