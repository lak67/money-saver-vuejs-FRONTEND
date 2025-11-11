import { createStore } from "vuex";
import { authModule } from "./modules/auth";

export interface RootState {
  // Add other modules here as they are created
}

export const store = createStore<RootState>({
  modules: {
    auth: authModule,
  },
});

export default store;
