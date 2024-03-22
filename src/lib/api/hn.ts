import { browser } from "$app/environment";
import { Comment, Item } from "$lib/types/hn/item";
import { useQueryClient } from "@tanstack/svelte-query";

export const api = (customFetch = fetch) => ({
  getItem: async (id: number, deep: boolean = false) => {
    const response = await customFetch(`/api/hn/item/${id}${ deep ? `?deep=${deep}` : '' }`)
    const data = (await response.json()) as Item

    return data
  },
  getItemPwa: async (id: number) => {
    const response = await customFetch(`/api/hnpwa/item/${id}`)
    const data = (await response.json()) as Item

    return data
  },
  getStories: async (kind: string) => {
    const response = await customFetch(`/api/hn/${kind}`)
    const data = (await response.json()) as number[]

    return data;
  },
  // getItemFull: async (id: number) => {
  //   const item = await getItem(customFetch, id)

  //   // console.log(JSON.stringify(item, null, 2))
  //   return item
  // }

})

// async function getItem(customFetch = fetch, id: number): Promise<Item> {
//   const response = await customFetch(`/api/hn/item/${id}`)
//   const data = (await response.json()) as Item

//   data.comments = await Promise.all(data.kids?.map(async (id): Promise<Comment> => {
//     const child = await getItem(customFetch, id) as Comment;

//     return child;
//   }) ?? []);


//   return data
// }