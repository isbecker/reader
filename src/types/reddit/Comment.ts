import type Post from "./Post";

export default interface Comment {
    id: string,
    permalink: string,
    author: string,
    body: string,
    body_html: string,
    date: number,
    ups: number,
    kind: string,
    replies?: Comment[],
    parent: Post | Comment,
    root?: Comment,
    isRoot: boolean
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseComment(comment: any, kind: string, parent: Post | Comment, root?: Comment): Comment {
    const parsed: Comment =
    {
        id: comment.id,
        permalink: comment.permalink,
        author: comment.author,
        body: comment.body,
        body_html: comment.body_html,
        date: comment.created_utc,
        ups: comment.ups,
        kind: kind,
        replies: [],
        parent: parent,
        root: root,
        isRoot: "url" in parent
    };

    parsed.replies = comment.replies?.data?.children?.map((c: any) => parseComment(c.data, c.kind, parsed, root || parsed))

    return parsed
}