// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["./modules/socketServer.ts", "@pinia/nuxt"],
  runtimeConfig: {
    // Private keys are only available on the server
    apiSecret: "123",
    // Public keys that are exposed to the client
    public: {
      wssUrl: process.env.WSS_URL || "",
      firebaseApiKey: process.env.API_BASE,
      apiBase: process.env.AUTH_DOMAIN,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID,
      measurementId: process.env.MEASUREMENT_ID,
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
