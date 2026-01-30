import moment from "moment";
import { parsePost } from "$lib/types/reddit/Post";

export async function load({ fetch, params }) {
	const { name, id, title } = params;
	return {
		post: await fetchComments(name, id, title, fetch).then(parsePost),
	};
}

async function fetchComments(
	subreddit: string,
	id: string,
	title: string,
	fetch,
): Promise<any> {
	const maxRetries = 3;
	let retryCount = 0;

	const url = `/api/reddit/${subreddit}/comments/${id}/${title}`;
	while (retryCount < maxRetries) {
		try {
			const response = await fetch(url);
			if (response.ok) {
				return await response.json();
			} else {
				throw new Error("Failed to fetch");
			}
		} catch (error) {
			console.error("Error:", error);
			retryCount++;
		}
	}

	return null;
}
