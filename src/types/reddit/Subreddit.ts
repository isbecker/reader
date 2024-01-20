import type Post from "./Post";
import { parseSubredditPost } from "./Post";

export default interface Subreddit {
    name: string,
    posts: Post[]
}

export async function parseSubreddit(name: string, subreddit: any): Promise<Subreddit | undefined> {
    if (!subreddit) return undefined;
    const parsedSubreddit: Subreddit = {
        name,
        posts: await Promise.all(subreddit?.data?.children?.map((p) => parseSubredditPost(p.data)))
    };

    return parsedSubreddit;
}