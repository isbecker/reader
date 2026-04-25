import moment from "moment";
import { parseSubreddit } from "$lib/types/reddit/Subreddit";

export async function load({ fetch, params }) {
	const { name } = params;
	return {
		subreddit: await fetchSubreddit(name, fetch).then(
			async (subreddit) => await parseSubreddit(name, subreddit),
		),
	};
}

async function fetchSubreddit(
	subreddit: string,
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
	const tag = `[reddit/r/${subreddit}/hot]`;

	for (let attempt = 1; attempt <= maxRetries; attempt++) {
		const redditUrl = `https://www.reddit.com/r/${subreddit}/hot.json?t=${moment().unix()}`;
		const url = `https://unquestioned.beckr.dev/?url=${encodeURIComponent(redditUrl)}`;
		console.log(`${tag} attempt ${attempt}/${maxRetries}`);
		try {
			const response = await fetch(url);
			if (response.ok) {
				console.log(`${tag} OK (attempt ${attempt})`);
				return await response.json();
			} else {
				const body = await response.text();
				console.error(`${tag} attempt ${attempt} failed: HTTP ${response.status} ${response.statusText} — ${body.slice(0, 200)}`);
			}
		} catch (error) {
			console.error(`${tag} attempt ${attempt} threw:`, error);
		}
	}

	console.error(`${tag} all ${maxRetries} attempts failed, returning null`);
	return null;
}
