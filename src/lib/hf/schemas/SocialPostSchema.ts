import { z } from 'zod';
import { AttachmentSchema } from '$lib/hf/schemas/AttachmentSchema';
import { ContentItemSchema } from '$lib/hf/schemas/ContentItemSchema';
import { AuthorSchema } from '$lib/hf/schemas/AuthorSchema';
import { ReactionSchema } from '$lib/hf/schemas/ReactionSchema';

export const SocialPostSchema = z.object({
  slug: z.string(),
  content: z.array(ContentItemSchema),
  rawContent: z.string(),
  author: AuthorSchema,
  attachments: z.array(AttachmentSchema).optional(),
  mentions: z.array(z.any()).optional(), // Adjust based on the actual structure of mentions
  reactions: z.array(ReactionSchema),
  publishedAt: z.string(),
  updatedAt: z.string(),
  url: z.string(),
  numComments: z.number(),
});

export type SocialPost = z.infer<typeof SocialPostSchema>;