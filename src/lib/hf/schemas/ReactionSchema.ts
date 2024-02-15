import { z } from 'zod';

export const ReactionSchema = z.object({
  reaction: z.string(),
  users: z.array(z.string()),
  count: z.number(),
});
