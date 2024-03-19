// src/routes/api/content/+server.ts
import { Readability } from '@mozilla/readability';
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { JSDOM } from 'jsdom';

export const GET: RequestHandler = async ({ request, fetch }) => {
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
        const dom = await JSDOM.fromURL(url, { pretendToBeVisual: true })
        const reader = new Readability(dom.window.document);
        const article = reader.parse();


        if (!article) {
            throw new Error(`Failed to parse content: ${url}`);
        }
        return json({ article });
    } catch (error) {
        const archive = await fetch(`/api/content/archive/readable?url=${url}`)
        const obj = await archive.json()
        return json(obj)
    }
};
