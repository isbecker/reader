import { z } from 'zod';

export const AttachmentSchema = z.object({
  type: z.string(),
  url: z.string(),
});