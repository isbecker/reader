export default interface Comment {
	id: number;
	author: string; // 'by' in the HN API
	kids?: number[]; // in the HN API, this is an array of comment IDs
	parent: number;
	text: string;
	time: number;
	type: string; // "comment"
	comments?: Comment[];
	root?: number;
	isRoot: boolean;
}

export function parseComment(comment: any, item?: number): Comment {
	return {
		id: comment.id,
		author: comment.by,
		parent: comment.parent,
		text: comment.text,
		time: comment.time,
		type: comment.type,
		kids: comment.kids,
		root: item,
		isRoot: !item,
	};
}

export function parsePwaComment(comment: any, item?: number): Comment {
	return {
		id: comment.id,
		author: comment.user,
		kids: comment.comments.map((c: any) => c.id),
		comments: comment.comments.map((c: any) => parsePwaComment(c)),
		parent: 0,
		text: comment.content,
		time: comment.time,
		type: comment.type,
		root: item,
		isRoot: !item,
	};
}
