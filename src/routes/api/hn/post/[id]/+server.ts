import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
    const { id } = params;


    const hnJson = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
        .then(async (res) => await res.json())
        .catch((err) => console.log(err));

    return new Response(JSON.stringify(hnJson), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}