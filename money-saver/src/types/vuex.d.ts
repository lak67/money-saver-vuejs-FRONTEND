declare module "vuex" {
  import {
    Store,
    StoreOptions,
    Module,
    createStore,
    useStore,
  } from "vuex/types";

  export { Store, StoreOptions, Module, createStore, useStore };
  export * from "vuex/types";
}
