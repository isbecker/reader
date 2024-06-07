import { json } from '@sveltejs/kit';
import { kv } from "@vercel/kv";

export async function POST({ request }) {
  const requestData = await request.json();

  // Generate a unique ID for this session/data
  const sessionId = Math.random().toString(36).substring(2);

  // Store the request data in the in-memory store with the sessionId as the key
  await kv.set(sessionId, requestData, {
    ex: 60 * 5 // 5 minutes
  });

  // Return the sessionId to the client
  return json({ sessionId });
}