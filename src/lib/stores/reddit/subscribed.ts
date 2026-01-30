import { browser } from "$app/environment";
import type Subscription from "$lib/types/reddit/Subscription";
import { writable } from "svelte/store";

const defaultValue: Subscription[] = [
	{ name: "programming", url: "/r/programming" },
	{ name: "technology", url: "/r/technology" },
	{ name: "science", url: "/r/science" },
	{ name: "news", url: "/r/news" },
	{ name: "gaming", url: "/r/gaming" },
];

const initialValue = browser
	? JSON.parse(
			localStorage.getItem("reddit.subscriptions"), // empty array is falsy
		) || defaultValue
	: defaultValue;
export const subscriptions = writable<Subscription[]>(initialValue);

subscriptions.subscribe((value) => {
	if (browser) {
		localStorage.setItem("reddit.subscriptions", JSON.stringify(value));
	}
});
