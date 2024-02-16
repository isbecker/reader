import { SocialPostSchema, type SocialPost } from '$lib/hf/schemas/SocialPostSchema';
import { z } from 'zod';

export interface SocialPostsData {
  socialPosts: SocialPost[];
  numTotalItems: number;
}

class PostParser {
  public static SocialPostsSchema = z.object({
    socialPosts: z.array(SocialPostSchema),
    numTotalItems: z.number(),
  });

  public static parseSocialPosts(data: any): SocialPostsData | null {
    try {
      return this.SocialPostsSchema.parse(data);
    } catch (error) {
      console.error("Validation error:", error);
      return null;
    }
  }

  public static safeParseSocialPosts(data: any): { success: boolean; data?: SocialPostsData; error?: z.ZodError } {
    const result = this.SocialPostsSchema.safeParse(data);

    if (result.success) {
      // The data is valid, and result.data contains the parsed data
      return { success: true, data: result.data };
    } else {
      // The data is invalid, and result.error contains the validation errors
      return { success: false, error: result.error };
    }
  }

  public static safeParseSocialPost(data: any): { success: boolean; data?: SocialPost; error?: z.ZodError } {
    const result = SocialPostSchema.safeParse(data);

    if (result.success) {
      // The data is valid, and result.data contains the parsed data
      return { success: true, data: result.data };
    } else {
      // The data is invalid, and result.error contains the validation errors
      return { success: false, error: result.error };
    }
  }

}

export default PostParser;