import type Readable from "../Reabable";
import { parseComment } from "./Comment";

export default interface Post {
    id: string,
    author: string,
    subreddit: string,
    permalink: string,
    slug: string,
    title: string,
    content: string,
    excerpt: string,
    readable?: Readable,
    url: string,
    date: number,
    length: number,
    image?: string,
    comments: Comment[],
    num_comments: number,
    ups: number,
    is_read: boolean
    post_hint?: string
    domain?: string
}

export async function parseSubredditPost(post: any): Promise<Post> {
    const parsedPost: Post = {
        id: post.id,
        author: post.author,
        subreddit: post.subreddit,
        permalink: post.permalink,
        slug: post.id,
        title: post.title || "Untitled",
        content: post.selftext_html || undefined,
        excerpt: post.selftext || undefined,
        readable: undefined,
        url: post.url,
        date: post.created_utc,
        length: 0,
        image: post.thumbnail || undefined,
        comments: [],
        num_comments: post.num_comments,
        ups: post.ups,
        is_read: false,
        post_hint: post.post_hint,
        domain: post.domain
    };

    return parsedPost;
}

export async function parsePost(post: any): Promise<Post> {
    const op = post[0].data.children[0].data;
    const comments = post[1].data.children

    const parsedPost: Post = {
        id: op.id,
        author: op.author,
        subreddit: op.subreddit,
        permalink: op.permalink,
        slug: op.id,
        title: op.title || "Untitled",
        content: op.selftext_html || undefined,
        excerpt: op.selftext || undefined,
        readable: undefined,
        url: op.url,
        date: op.created_utc,
        length: 0,
        image: op.thumbnail || undefined,
        comments: [],
        num_comments: op.num_comments,
        is_read: false,
        post_hint: op.post_hint,
        domain: op.domain
    };

    parsedPost.comments = comments?.map((c) => parseComment(c.data, c.kind, parsedPost))

    return parsedPost;
}
