import type Readable from "$lib/types/Reabable";
import { parseReadable } from "$lib/types/Reabable";
import { Item } from "$lib/types/hn/item";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch, params }) => {
	const { id } = params;

	const storyRes = await fetch(
		`https://hacker-news.firebaseio.com/v0/item/${id}.json`,
	);
	if (!storyRes.ok) {
		error(storyRes.status, "Failed to fetch story");
	}
	const storyData = await storyRes.json();
	if (!storyData) {
		error(404, "Story not found");
	}
	const story: Item = Item.createFromOfficial(storyData);

	if (!story.url) {
		error(400, "Story has no URL to render");
	}

	const readableRes = await fetch(
		`/api/content/readable?url=${encodeURIComponent(story.url)}`,
	);
	if (!readableRes.ok) {
		error(readableRes.status, "Failed to fetch readable content");
	}
	const readable: Readable = parseReadable(await readableRes.json());

	return { story, readable };
};
