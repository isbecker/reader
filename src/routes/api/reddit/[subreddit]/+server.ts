// src/routes/api/reddit/[subreddit].ts
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
    const { subreddit } = params;

    try {
        const response = await fetch(`https://corsproxy.io/?${encodeURIComponent(`https://www.reddit.com/r/${subreddit}/hot.json`)}`);
        const data = await response.json();


        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: (error as Error).message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
};
