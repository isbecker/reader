
export default interface Comment {
  id: number,
  author: string, // 'by' in the HN API
  kids?: number[], // in the HN API, this is an array of comment IDs
  parent: number,
  text: string,
  time: number,
  type: string // "comment"
  children?: Comment[]
}

export function parseComment(comment: any): Comment {
  return {
    id: comment.id,
    author: comment.by,
    parent: comment.parent,
    text: comment.text,
    time: comment.time,
    type: comment.type,
    kids: comment.kids,
  }
}

export async function loadChildren(comment: Comment): Promise<Comment[] | undefined> {

  if (!comment.kids) return undefined;

  const comments = await Promise.all(comment.kids.map(async (id) => {
    const response = await fetch(`/api/hn/post/${id}`);
    const commentRes = await response.json();

    const comment = parseComment(commentRes);
    comment.children = await loadChildren(comment);

    return comment
  }));

  return comments;
}