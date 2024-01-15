import type { RequestHandler } from '@sveltejs/kit';

// TODO: Add Firebase HN connection
// import { initializeApp, type FirebaseApp } from 'firebase/app';
// const app: FirebaseApp = initializeApp({ databaseURL: "https://hacker-news.firebaseio.com/v0/" });


export const GET: RequestHandler = async () => {

  const hnJson = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
    .then(async (res) => await res.json())
    .catch((err) => console.log(err));

  return new Response(JSON.stringify(hnJson), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}