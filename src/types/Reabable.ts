export default interface Readable {
  title: string | null,
  byline: string | null,
  lang: string | null,
  content: string | null,
  textContent: string | null,
  length: number | null,
  excerpt: string | null,
  siteName: string | null,
  publishedTime: string | null, // TODO: make a date type?
  error: string | null
}

export function parseReadable(readableJson: any) {
  if (readableJson.error) {
    const error: Readable = {
      title: null,
      byline: null,
      lang: null,
      content: null,
      textContent: null,
      length: null,
      excerpt: null,
      siteName: null,
      publishedTime: null,
      error: readableJson.error
    }

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
      error: null
    }
    return readable;

  }
}