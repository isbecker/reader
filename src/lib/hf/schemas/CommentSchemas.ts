import { z } from 'zod';
import { AuthorSchema } from '$lib/hf/schemas/AuthorSchema';

const CommentDataSchema = z.object({
  edited: z.boolean(),
  hidden: z.boolean(),
  latest: z.object({
    raw: z.string().optional(), // Make optional
    html: z.string().optional(), // Make optional
    updatedAt: z.string().optional(), // Make optional
    author: AuthorSchema.optional(), // Make the whole author object optional
  }).optional(), // Make the latest object optional
  numEdits: z.number(),
  editors: z.array(z.string()),
  reactions: z.array(z.object({
    reaction: z.string(),
    users: z.array(z.string()),
    count: z.number(),
  })).optional(), // Make reactions optional
  identifiedLanguage: z.object({
    language: z.string(),
    probability: z.number(),
  }).optional(),
  isReport: z.boolean().optional(),
});

const CommentSchema = z.lazy(() => z.object({
  id: z.string(),
  author: AuthorSchema.optional(),
  createdAt: z.string(),
  type: z.string(),
  data: CommentDataSchema,
  replies: z.array(z.lazy(() => CommentSchema)).optional(),
}));


export { CommentSchema };
export type Comment = z.infer<typeof CommentSchema>;
