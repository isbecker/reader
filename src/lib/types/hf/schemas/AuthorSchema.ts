import { z } from 'zod';

export const AuthorSchema = z.object({
  avatarUrl: z.string().optional(),
  fullname: z.string(),
  name: z.string(),
  type: z.string(),
  isPro: z.boolean(),
  isHf: z.boolean(),
  isFollowing: z.boolean().optional(),
});