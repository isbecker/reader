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
    readable: Readable,
    url: string,
    date: number,
    length: number,
    image: string,
    comments: Comment[],
    num_comments: number,
    is_read: boolean
    post_hint?: string
    domain?: string
}

export async function parsePost(post: any): Promise<Post> {
    post = post.data;
    const parsedPost: Post = {
        id: post.id,
        author: post.author,
        subreddit: post.subreddit,
        permalink: post.permalink,
        slug: post.id,
        title: post.title || "Untitled",
        content: post.selftext_html || "Read more",
        excerpt: post.selftext || undefined,
        readable: "nothing",
        url: post.url,
        date: post.created_utc,
        length: 0,
        image: post.thumbnail,
        comments: post.comments?.data?.children?.map(parseComment),
        num_comments: post.num_comments,
        is_read: false,
        post_hint: post.post_hint,
        domain: post.domain
    };
    return parsedPost;
}
