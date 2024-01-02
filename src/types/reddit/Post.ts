import { parseComment } from "./Comment"

export default interface Post {
    id: string,
    author: string,
    subreddit: string,
    permalink: string,
    slug: string,
    title: string,
    content: string,
    excerpt: string,
    date: number,
    length: number,
    image: string,
    comments: Comment[]
    is_read: boolean
}

export function parsePost(post: any): Post {
    return {
        id: post.id,
        author: post.author,
        subreddit: post.subreddit,
        permalink: post.permalink,
        slug: post.id,
        title: post.title,
        content: post.selftext_html || "Read more",
        excerpt: post.selftext_html || undefined,
        date: post.created_utc,
        length: post.selftext_html.length,
        image: post.thumbnail,
        comments: post.comments?.data?.children?.map(parseComment),
        is_read: false
    };
}
