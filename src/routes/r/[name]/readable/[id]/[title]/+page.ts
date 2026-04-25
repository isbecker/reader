import moment from "moment";
import { parseReadable } from "$lib/types/Reabable.js";
import type Post from "$lib/types/reddit/Post.js";
import { parsePost } from "$lib/types/reddit/Post.js";

export async function load({ fetch, params }) {
	const { name, id, title } = params;

	const maxRetries = 3;
	const tag = `[reddit/r/${name}/readable/${id}]`;

	for (let attempt = 1; attempt <= maxRetries; attempt++) {
		const redditUrl = `https://old.reddit.com/r/${name}/comments/${id}/${title}.json?t=${moment().unix()}`;
		const url = `https://unquestioned.beckr.dev/?url=${encodeURIComponent(redditUrl)}`;
		console.log(`${tag} attempt ${attempt}/${maxRetries}`);
		try {
			const response = await fetch(url);
			if (response.ok) {
				console.log(`${tag} reddit OK (attempt ${attempt}), fetching readable`);
				const post: Post = await response
					.json()
					.then((data) => (data ? parsePost(data) : null));
				const readable = await fetch(`/api/content/readable?url=${post.url}`)
					.then(async (res) => await res.json())
					.then(parseReadable);

				return { post, readable };
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
