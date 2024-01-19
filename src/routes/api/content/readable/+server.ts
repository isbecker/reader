// src/routes/api/content/+server.ts
import { Readability } from '@mozilla/readability';
import type { RequestHandler } from '@sveltejs/kit';
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
        const article = await JSDOM.fromURL(url)
            .then(function (dom) {
                const reader = new Readability(dom.window.document);
                return reader.parse();
            });

        if (!article) {
            throw new Error(`Failed to parse content: ${url}`);
        }
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
