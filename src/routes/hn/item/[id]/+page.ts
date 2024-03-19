// import { parsePwaStory } from "../../../../types/hn/Story";
// import { parsePwaStory } from "../../../../types/hn/Story";
import type { Item } from '$lib/types/hn/item';

export const load = async ({ parent, fetch, params }) => {

  const { queryClient } = await parent();
  const { id } = params;

  const fetchStory = async () => {
    return await fetch(`/api/hnpwa/item/${id}`)
      .then(async (res) => await res.json())
      .then(async (hnpwa) => hnpwa as Item);
  }

  await queryClient.prefetchQuery({
    queryKey: ['item', id],
    queryFn: fetchStory,
  });

  return {
    item: await fetchStory()
  }


  // const story: Promise<Story> = fetch(`/api/hn/item/${id}`)
  //   .then((res) => res.json())
  //   .then((story) => parseStory(story));

  // const comments = story.then((story) => {
  //   return Promise.all(
  //     story.kids?.map(async (id): Promise<Comment> => {
  //       const res = await fetch(`/api/hn/item/${id}`);
  //       const comment = await res.json();
  //       const parsed = parseComment(comment);

  //       return parsed;
  //     }) || [])
  // });


}

// async function loadChildren(comment: Comment,
//   fetch: {
//     (input: URL | RequestInfo, init?: RequestInit | undefined): Promise<Response>;
//     (input: string | URL | Request, init?: RequestInit | undefined): Promise<Response>;
//   }): Promise<Comment[] | undefined> {

//   return await Promise.all(comment.kids?.map(async (id) => {
//     const res = await fetch(`/api/hn/item/${id}`);
//     const comment = await res.json();
//     const child = parseComment(comment);
//     child.children = await loadChildren(child, fetch);
//     return child;
//   }) || []);
// }