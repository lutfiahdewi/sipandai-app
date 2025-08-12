// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css',],
  vite: {
    plugins: [
      tailwindcss(),
      tsconfigPaths()
    ],
  },
  modules: ['@nuxt/image', '@nuxt/icon', '@nuxtjs/supabase'],
  supabase: {
    redirect: false,
  }
})