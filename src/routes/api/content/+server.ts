// src/routes/api/content/+server.ts
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ request, fetch }) => {
    const url = new URL(request.url).searchParams.get('url')
    if (!url) {
        return new Response(JSON.stringify(
            { error: 'URL parameter is required' }
        ), {
            status: 400,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    try {
        // console.log(`Fetching ${url}`);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch content: ${response.statusText}`);
        }


        const content = await response.text();
        // console.log(content)
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
