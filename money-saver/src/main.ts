import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { store } from "./store";
import "./style.css";

const app = createApp(App);

// Initialize auth state before mounting
async function initializeApp() {
  // Check for existing auth state on startup
  await store.dispatch("auth/checkAuth");

  app.use(store);
  app.use(router);
  app.mount("#app");
}

// Initialize the app
initializeApp();
