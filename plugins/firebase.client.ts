import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const firebaseConfig = {
    apiKey: config.public.firebaseApiKey,
    authDomain: config.public.apiBase,
    projectId: config.public.projectId,
    storageBucket: config.public.storageBucket,
    messagingSenderId: config.public.messagingSenderId,
    appId: config.public.appId,
    measurementId: config.public.measurementId,
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  // const analytics = getAnalytics(app);

  const auth = getAuth(app);

  nuxtApp.vueApp.provide("auth", auth);
  nuxtApp.provide("auth", auth);
});
