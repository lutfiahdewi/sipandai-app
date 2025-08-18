// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css',],
  plugins:[
    { src: '~/plugins/vue-good-table-next', ssr: false },
  ],
  vite: {
    plugins: [
      tailwindcss(),
      tsconfigPaths(),
    ],
    server: {
        allowedHosts: ['bpspolman.ddns.net'],
      },
  },
  modules: ['@nuxt/image', '@nuxt/icon', '@nuxtjs/supabase'],
  supabase: {
    redirect: false,
  }
})