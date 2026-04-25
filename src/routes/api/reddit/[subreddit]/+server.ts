// src/routes/api/reddit/[subreddit].ts
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ params, fetch }) => {
	const { subreddit } = params;

	try {
		const proxyUrl = `https://unquestioned.beckr.dev/?url=${encodeURIComponent(`https://reddit.com/r/${subreddit}/hot.json`)}`;
		const response = await fetch(proxyUrl);

		if (!response.ok) {
			const body = await response.text();
			console.error(
				`[reddit/${subreddit}] proxy returned ${response.status}: ${body.slice(0, 500)}`,
			);
			return new Response(
				JSON.stringify({
					error: `Proxy error: ${response.status} ${response.statusText}`,
				}),
				{
					status: response.status,
					headers: { "Content-Type": "application/json" },
				},
			);
		}

		const data = await response.json();

		return new Response(JSON.stringify(data), {
			status: 200,
			headers: {
				"Content-Type": "application/json",
			},
		});
	} catch (error) {
		console.error(`[reddit/${subreddit}] fetch error:`, error);
		return new Response(JSON.stringify({ error: (error as Error).message }), {
			status: 500,
			headers: {
				"Content-Type": "application/json",
			},
		});
	}
};
