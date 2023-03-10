// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  typescript: {
    tsConfig: {
      extends: "@tsconfig/strictest/tsconfig.json",
    },
  },
  app: {
    cdnURL: "/gen-sdf/",
    baseURL: "/gen-sdf/",
  },
});
