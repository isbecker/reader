import type Post from "./Post";
import { parsePost } from "./Post";

export default interface Subreddit {
    name: string,
    // title: string,
    // description: string,
    posts: Post[]
}

export async function parseSubreddit(name: string, subreddit: any): Promise<Subreddit> {
    const parsedSubreddit: Subreddit = {
        name,
        // title: subreddit?.data?.title,
        // description: subreddit?.data?.public_description,
        posts: await Promise.all(subreddit?.data?.children?.map(parsePost))
    };

    return parsedSubreddit;
}