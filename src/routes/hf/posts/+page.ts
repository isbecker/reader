import type { SocialPostsData } from "$lib/types/hf/PostParser";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ parent, fetch, url }) => {
	const { queryClient } = await parent();
	const skip: number = parseInt(url.searchParams.get("skip") ?? "0", 10);

	const fetchPosts = async (): Promise<SocialPostsData> => {
		const hf = await fetch(`/api/hf/posts?skip=${skip}`);
		const hfJson = await hf.json();
		return hfJson;
	};

	await queryClient.prefetchQuery({
		queryKey: ["hf", "posts", skip],
		queryFn: fetchPosts,
	});

	// const hfJson: Promise<SocialPostsData> = fetch(`/api/hf/posts`)
	//   .then(async (res) => await res.json())
	//   .catch((err) => console.log(err));

	return { skip };
};
