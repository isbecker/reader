import type { Post } from "./Post";
import { parsePost } from "./Post";

export interface Subreddit {
    name: string,
    title: string,
    description: string,
    posts: Post[]
}

export function parseSubreddit(subreddit: any): Subreddit {
    return {
        name: subreddit.name,
        title: subreddit.title,
        description: subreddit.public_description,
        posts: subreddit.children.map(parsePost)
    };
}