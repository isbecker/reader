import type Post from "$lib/types/reddit/Post";
import { parseSubredditPost } from "$lib/types/reddit/Post";

export default interface Subreddit {
	name: string;
	posts: Post[];
}

export async function parseSubreddit(
	name: string,
	subreddit: any,
): Promise<Subreddit | undefined> {
	if (!subreddit) return undefined;
	const parsedSubreddit: Subreddit = {
		name,
		posts: await Promise.all(
			subreddit?.data?.children?.map((p) => parseSubredditPost(p.data)),
		),
	};

	return parsedSubreddit;
}
