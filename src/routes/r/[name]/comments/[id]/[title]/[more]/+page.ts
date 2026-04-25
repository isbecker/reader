import moment from "moment";
import { parsePost } from "$lib/types/reddit/Post";

export async function load({ fetch, params }) {
	const { name, id, title, more } = params;
	return {
		post: await fetchComments(name, id, title, more, fetch).then((data) =>
			data ? parsePost(data) : null,
		),
	};
}

async function fetchComments(
	subreddit: string,
	id: string,
	title: string,
	more: string,
	fetch: {
		(
			input: URL | RequestInfo,
			init?: RequestInit | undefined,
		): Promise<Response>;
		(
			input: string | URL | Request,
			init?: RequestInit | undefined,
		): Promise<any>;
	},
): Promise<any> {
	const maxRetries = 3;
	const tag = `[reddit/r/${subreddit}/comments/${id}/${more}]`;

	for (let attempt = 1; attempt <= maxRetries; attempt++) {
		const redditUrl = `https://reddit.com/r/${subreddit}/comments/${id}/${title}/${more}.json?t=${moment().unix()}`;
		const url = `https://unquestioned.beckr.dev/?url=${encodeURIComponent(redditUrl)}`;
		console.log(`${tag} attempt ${attempt}/${maxRetries}`);
		try {
			const response = await fetch(url);
			if (response.ok) {
				console.log(`${tag} OK (attempt ${attempt})`);
				return await response.json();
			} else {
				const body = await response.text();
				console.error(
					`${tag} attempt ${attempt} failed: HTTP ${response.status} ${response.statusText} — ${body.slice(0, 200)}`,
				);
			}
		} catch (error) {
			console.error(`${tag} attempt ${attempt} threw:`, error);
		}
	}

	console.error(`${tag} all ${maxRetries} attempts failed, returning null`);
	return null;
}
