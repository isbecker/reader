import type Subreddit from "../../../types/reddit/Subreddit";
import { parseSubreddit } from "../../../types/reddit/Subreddit";
import moment from "moment";

export async function load({ fetch, params }) {

    const { name } = params;
    const subreddit: Subreddit | undefined = await fetchSubreddit(name, fetch)
        .then(async (subreddit) => await parseSubreddit(name, subreddit));
    return subreddit ? { subreddit } : { status: 404 };
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
            const response = await fetch(`https://corsproxy.io/?${encodeURIComponent(`https://www.reddit.com/r/${subreddit}/hot.json?t=${moment().unix()}`)}`);
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