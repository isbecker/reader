// src/routes/api/content/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import fetch from 'cross-fetch';

export const GET: RequestHandler = async ({ params }) => {
    const { subreddit, id } = params;
    if (!subreddit || !id) {
        return new Response(JSON.stringify(
            { error: 'subreddit and id parameters are required' }
        ), {
            status: 400,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    try {
        // const url = `https://www.reddit.com/r/${subreddit}/comments/${id}.json?sort=top`;
        const url = `https://corsproxy.io/?${encodeURIComponent(`https://www.reddit.com/r/${subreddit}/${id}.json?t=${moment().unix()}`)}`
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch comments: ${response.statusText}`);
        }


        const content = await response.json();
        return new Response(JSON.stringify(content), {
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
