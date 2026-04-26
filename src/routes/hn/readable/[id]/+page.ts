import type Readable from "$lib/types/Reabable";
import { parseReadable } from "$lib/types/Reabable";
import type { Item } from "$lib/types/hn/item";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch, params }) => {
	const { id } = params;

	const story: Item = await fetch(`/api/hn/item/${id}`).then((res) =>
		res.json(),
	);

	const readable: Readable = await fetch(
		`/api/content/readable?url=${story.url}`,
	)
		.then((res) => res.json())
		.then(parseReadable);

	return { story, readable };
};
