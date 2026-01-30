// import { createQuery } from "@tanstack/svelte-query";
// import { parseStory } from "../../../types/hn/Story";
import { api } from "$lib/api/hn";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ parent, fetch, params, url }) => {
	const { queryClient } = await parent();
	const { stories } = params; // top, hot, new, best, ask, show, job
	const skip = parseInt(url.searchParams.get("skip") ?? "0");
	const size = parseInt(url.searchParams.get("size") ?? "30");

	await queryClient.prefetchQuery({
		queryKey: ["hn", "stories", stories],
		queryFn: () => api(fetch).getStories(stories),
	});

	return {
		kind: stories,
		skip: skip,
		size: size,
	};
};
