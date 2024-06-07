import { browser } from "$app/environment";
import type Subscription from "$lib/types/reddit/Subscription";
import { writable } from "svelte/store";

const defaultValue: Subscription[] = [
  { name: "programming", url: "/r/programming" },
  { name: "technology", url: "/r/technology" },
  { name: "science", url: "/r/science" },
  { name: "news", url: "/r/news" },
  { name: "gaming", url: "/r/gaming" },
]

const storedValue = browser ? localStorage.getItem("reddit.subscriptions") : null;
const initialValue = storedValue ? JSON.parse(storedValue) : defaultValue;
export const subscriptions = writable<Subscription[]>(initialValue);

subscriptions.subscribe((value) => {
  if (browser) {
    localStorage.setItem("reddit.subscriptions", JSON.stringify(value));
  }
});