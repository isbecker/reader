import { browser } from "$app/environment";
import { writable } from "svelte/store";


const defaultValue: string = "dark";

const initialValue = browser ? localStorage.getItem("app.theme") || defaultValue : defaultValue

export const theme = writable<string>(initialValue);

theme.subscribe((value) => {
  if (browser) {
    localStorage.setItem("app.theme", value);
  }
});