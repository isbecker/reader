import { browser } from "$app/environment";
import { writable } from "svelte/store";


let defaultValue: string = "dark";
if (browser) {
  defaultValue = window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light";
}

const initialValue = browser ? localStorage.getItem("app.theme") || defaultValue : defaultValue

export const theme = writable<string>(initialValue);

theme.subscribe((value) => {
  if (browser) {
    localStorage.setItem("app.theme", value);
  }
});