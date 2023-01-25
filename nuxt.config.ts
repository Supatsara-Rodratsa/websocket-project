// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["./modules/socketServer.ts", "@pinia/nuxt"],
  runtimeConfig: {
    // Private keys are only available on the server
    apiSecret: "123",
    // Public keys that are exposed to the client
    public: {
      wssUrl: process.env.WSS_URL || "",
    },
  },
  typescript: {
    shim: false,
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  css: ["@/assets/css/main.css"],
});
