import { writable } from "svelte/store";
import type Swiper from "swiper";

export const swiperStore = writable<Swiper>(undefined);
