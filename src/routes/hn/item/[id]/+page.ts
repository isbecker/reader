import { api } from "$lib/api/hn";
import type { Item } from "$lib/types/hn/item";
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, fetch, params }) => {

  const { queryClient } = await parent();
  const { id } = params;
  const itemId = parseInt(id)
  // const pwaStory = await api(fetch).getItemPwa(itemId);
  // console.debug("finished pwa cache fetch");

  const full = (async () => {
    // console.log(`${moment().unix()} - Fetching full item`)
    return api(fetch).getItem(itemId, true)
  })()

  // full.finally(() => {
  //   console.log(`${moment().unix()} - Full item fetched`)
  // })



  // await queryClient.prefetchQuery({
  //   queryKey: ["hnpwa", "item", itemId],
  //   queryFn: () => api(fetch).getItemPwa(itemId),
  // });
  const cached = queryClient.getQueryData<Item>(["hn", "item", itemId])
  if (cached) {
    if (cached.kids && cached.comments?.length === 0) {
      // console.log(`${moment().unix()} - removing cached item`)
      queryClient.removeQueries({ queryKey: ["hn", "item", itemId] })
    }
  }
  queryClient.prefetchQuery({
    queryKey: ["hn", "item", itemId],
    queryFn: () => full
  });

  // console.log(`${moment().unix()} - returning from load`)
  return {
    itemId: itemId,
    story: await api(fetch).getItemPwa(itemId)
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