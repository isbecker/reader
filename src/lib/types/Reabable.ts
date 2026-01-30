export default interface Readable {
	title?: string;
	byline?: string;
	lang?: string;
	content?: string;
	textContent?: string;
	length?: number;
	excerpt?: string;
	siteName?: string;
	publishedTime?: string; // TODO: make a date type?
	error?: string;
}

export function parseReadable(readableJson: any): Readable {
	if (readableJson.error) {
		const error: Readable = {
			error: readableJson.error,
		};

		return error;
	} else {
		readableJson = readableJson.article;
		const readable: Readable = {
			title: readableJson.title,
			byline: readableJson.byline,
			lang: readableJson.lang,
			content: readableJson.content,
			textContent: readableJson.textContent,
			length: Number.parseInt(readableJson.length),
			excerpt: readableJson.excerpt,
			siteName: readableJson.siteName,
			publishedTime: readableJson.publishedTime,
		};
		return readable;
	}
}
