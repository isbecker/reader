import { z } from 'zod';

// Existing content item schema for types other than "mention"
const BaseContentItemSchema = z.object({
  type: z.enum(['text', 'link', 'new_line', 'resource']), // Enumerate all known types except "mention"
  value: z.string().optional(),
  raw: z.string(),
  href: z.string().optional(),
  resource: z.object({
    type: z.string(),
    id: z.string(),
  }).optional(),
  url: z.string().optional(),
});

// Schema for "mention" type content items
const MentionContentItemSchema = z.object({
  type: z.literal('mention'), // Explicitly define the type as "mention"
  user: z.string(),
  raw: z.string(),
});
const InlineCodeContentSchema = z.object({
  type: z.literal('inline_code'), // Ensures the type is exactly "inline_code"
  code: z.string(), // Assuming the field for the code content is named "code"
  raw: z.string(),
});
const CodeFenceContentSchema = z.object({
  type: z.literal('code_fence'), // Ensures the type is exactly "code_fence"
  code: z.string(), // Assuming the field for the code content is named "code"
  raw: z.string(),
});
// Combine schemas using discriminated union
const ContentItemSchema = z.discriminatedUnion('type', [BaseContentItemSchema, MentionContentItemSchema, InlineCodeContentSchema, CodeFenceContentSchema]);
export { BaseContentItemSchema, CodeFenceContentSchema, ContentItemSchema, InlineCodeContentSchema, MentionContentItemSchema };

