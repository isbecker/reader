import { z } from "zod";

export const ItemSchema = z.object({
	id: z.number(),
	by: z.string().optional(),
	descendants: z.number().optional(),
	kids: z.array(z.number()).optional(),
	score: z.number().optional(),
	time: z.number(),
	title: z.string().optional(),
	type: z.enum(["job", "story", "comment", "poll", "pollopt"]).optional(),
	url: z.string().optional(),
	text: z.string().optional(),
	deleted: z.boolean().optional(),
	dead: z.boolean().optional(),
	parent: z.number().optional(),
	poll: z.number().optional(),
	parts: z.array(z.number()).optional(),
});

export type Item = z.infer<typeof ItemSchema>;
