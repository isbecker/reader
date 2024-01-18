
export default interface Comment {
  id: number,
  author: string, // 'by' in the HN API
  kids?: number[], // in the HN API, this is an array of comment IDs
  parent: number,
  text: string,
  time: number,
  type: string // "comment"
  children?: Comment[],
  root?: number
  isRoot: boolean
}

export function parseComment(comment: any, story?: number): Comment {
  return {
    id: comment.id,
    author: comment.by,
    parent: comment.parent,
    text: comment.text,
    time: comment.time,
    type: comment.type,
    kids: comment.kids,
    root: story,
    isRoot: story? false : true // Update isRoot to ensure it is of type boolean
  }
}