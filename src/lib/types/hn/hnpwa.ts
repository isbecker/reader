import { z } from 'zod';

export interface Item {
  id: number;
  title?: string;
  points?: number | null;
  user?: string | null;
  time: number;
  time_ago: string;
  content: string;
  deleted?: boolean;
  dead?: boolean;
  type?: string;
  url?: string;
  domain?: string;
  comments?: Item[]; // Comments are items too
  level?: number;
  comments_count: number;
}

export const ItemSchema: z.ZodSchema<Item> = z.lazy(() => z.object({
  id: z.number(),
  title: z.string().optional(),
  points: z.number().nullable().optional(),
  user: z.string().nullable().optional(),
  time: z.number(),
  time_ago: z.string(),
  content: z.string(),
  deleted: z.boolean().optional(),
  dead: z.boolean().optional(),
  type: z.enum(
    [
      'job',
      'link',
      'comment',
    ]
  ),
  url: z.string().optional(),
  domain: z.string().optional(),
  comments: z.array(ItemSchema).optional(),
  level: z.number().optional(),
  comments_count: z.number(),
}));
