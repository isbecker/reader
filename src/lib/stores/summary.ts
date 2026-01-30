interface SummaryRequest {
	content: string;
}

export const summaryStore = new Map<string, SummaryRequest>();
