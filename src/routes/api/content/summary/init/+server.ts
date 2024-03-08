import { json } from '@sveltejs/kit';
import { summaryStore } from "../../../../../lib/stores/summary";

export async function POST({ request }) {
  const requestData = await request.json();

  // Generate a unique ID for this session/data
  const sessionId = Date.now().toString(36) + Math.random().toString(36).substring(2);

  // Store the request data in the in-memory store with the sessionId as the key
  summaryStore.set(sessionId, requestData);

  // Return the sessionId to the client
  return json({ sessionId });
}