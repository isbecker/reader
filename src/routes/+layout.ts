import { dev } from '$app/environment';
import { inject } from '@vercel/analytics';
import { browser } from '$app/environment'
import { QueryClient } from '@tanstack/svelte-query'
import type { LayoutLoad } from './$types'

export const load: LayoutLoad = async () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        enabled: browser,
        staleTime: 1000 * 60 * 10,
      },
    },
  })

  return { queryClient }
}

 
inject({ mode: dev ? 'development' : 'production' });