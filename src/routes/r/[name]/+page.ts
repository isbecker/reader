import moment from "moment";
import { parseSubreddit } from "$lib/types/reddit/Subreddit";

export async function load({ fetch, params }) {

    const { name } = params;
    return {
        subreddit: await fetchSubreddit(name, fetch)
            .then(async (subreddit) => await parseSubreddit(name, subreddit))

    }
}


async function fetchSubreddit(subreddit: string,
    fetch: {
        (input: URL | RequestInfo, init?: RequestInit | undefined): Promise<Response>;
        (input: string | URL | Request, init?: RequestInit | undefined): Promise<any>;
    }): Promise<any> {
    const maxRetries = 3;
    let retryCount = 0;

    while (retryCount < maxRetries) {
        try {
            const url = `https://corsproxy.io/?${encodeURIComponent(`https://www.reddit.com/r/${subreddit}/hot.json?t=${moment().unix()}`)}`
            const response = await fetch(url);
            // const response = await fetch(`/api/reddit/${subreddit}`);
            if (response.ok) {
                return await response.json();
            } else {
                throw new Error("Failed to fetch");
            }
        } catch (error) {
            console.error("Error:", error);
            retryCount++;
        }
    }

    return null;
}