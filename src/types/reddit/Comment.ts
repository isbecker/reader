export default interface Comment {
    id: string,
    permalink: string,
    author: string,
    body: string,
    date: number,
    replies?: Comment[]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseComment(comment: any): Comment {
    return {
        id: comment.id,
        permalink: comment.permalink,
        author: comment.author,
        body: comment.body,
        date: comment.created_utc,
        replies: comment.replies?.data?.children?.map(parseComment)
    };
}