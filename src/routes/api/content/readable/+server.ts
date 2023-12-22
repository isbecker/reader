// src/routes/api/content/+server.ts
import { Readability } from '@mozilla/readability';
import type { RequestHandler } from '@sveltejs/kit';
import fetch from 'cross-fetch';
import { JSDOM } from 'jsdom';

export const GET: RequestHandler = async ({ request }) => {
    const url = new URL(request.url).searchParams.get('url')
    if (!url) {
        return new Response(JSON.stringify({ error: 'URL parameter is required' }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch content: ${response.statusText}`);
        }

        const text = await response.text();
        const dom = new JSDOM(text);
        const reader = new Readability(dom.window.document);
        const article = reader.parse();

        // console.log(JSON.stringify(article, null, 2))

        return new Response(JSON.stringify({ article }), {
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
