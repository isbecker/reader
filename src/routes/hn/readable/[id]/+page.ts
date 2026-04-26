import type Readable from "$lib/types/Reabable";
import { parseReadable } from "$lib/types/Reabable";
import type { Item } from "$lib/types/hn/item";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch, params }) => {
	const { id } = params;

	const storyRes = await fetch(`/api/hn/item/${id}`);
	if (!storyRes.ok) {
		error(storyRes.status, "Failed to fetch story");
	}
	const story: Item = await storyRes.json();

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
