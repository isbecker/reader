import { Comment, Item } from "$lib/types/hn/item";
import type { Config } from "@sveltejs/adapter-vercel";
import { json, redirect, type RequestHandler } from "@sveltejs/kit";

export const config: Config = {
	runtime: "edge",
};

export const GET: RequestHandler = async ({ params, fetch, url }) => {
	const { id } = params;
	const deep = url.searchParams.get("deep") ?? "false";

	const itemId = parseInt(id as string);

	const maxItems = 1500;
	const fetchedItem = await fetchItem(itemId, fetch);
	if (!fetchedItem) {
		return json({ error: "Item not found" }, { status: 404 });
	}
	let item: Item = fetchedItem;
	if ((item.descendants ?? 0) > maxItems) {
		redirect(307, `/api/hnpwa/item/${id}`);
	}

	if (deep === "true") {
		item = await fetchItemFull(item, fetch);
	}

	return json(item, {
		status: 200,
		headers: {
			"Content-Type": "application/json",
			"Cache-Control":
				"max-age=10, public, s-maxage=10, stale-while-revalidate=10, stale-if-error=10",
			"CDN-Cache-Control":
				"max-age=60, public, s-maxage=60, stale-while-revalidate=60, stale-if-error=60",
			"Vercel-CDN-Cache-Control":
				"max-age=3600, public, s-maxage=3600, stale-while-revalidate=3600, stale-if-error=3600",
		},
	});
};

async function fetchItem(
	id: number,
	customFetch = fetch,
): Promise<Item | null> {
	const response = await customFetch(
		`https://hacker-news.firebaseio.com/v0/item/${id}.json`,
	);
	if (!response.ok) {
		return null;
	}
	const data = await response.json();
	if (!data) {
		return null;
	}

	return Item.createFromOfficial(data);
}

async function fetchItemFull(item: Item, customFetch = fetch): Promise<Item> {
	if (!item.kids) {
		item.comments = [];
		return item;
	}

	const results = await Promise.all(
		item.kids.map(async (kid) => {
			const child = await fetchItem(kid, customFetch);
			if (!child) return null;
			const comment = child as Comment;
			comment.root =
				(item as Comment).root ??
				(item.type === "comment" ? item.id : undefined);
			return (await fetchItemFull(comment, customFetch)) as Comment;
		}),
	);
	item.comments = results.filter((c): c is Comment => c !== null);

	return item;
}
