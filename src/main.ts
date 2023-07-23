import { createSSRApp } from "vue";
import App from "./App.vue";

import DemoItem from "@/components/demo/demo-item.vue"

export function createApp() {
  const app = createSSRApp(App);

  // 注册全局组件
  app.component("DemoItem", DemoItem);

  return {
    app
  };
}
