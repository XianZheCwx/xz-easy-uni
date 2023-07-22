import { createSSRApp, defineAsyncComponent } from "vue";
import type { Component } from "vue";
import App from "./App.vue";

interface GlobalComponent {
  name: string;
  component: Component;
}

const components: GlobalComponent[] = [];

const asyncComponents: GlobalComponent[] = [
  {
    name: "demo-item",
    component: defineAsyncComponent({ loader: () => import("@/components/demo/demo-item.vue") })
  }
];

export function createApp() {
  const app = createSSRApp(App);

  // 注册全局组件
  for (let com of components.concat(asyncComponents)) {
    app.component(com.name as string, com);
  }

  return {
    app
  };
}
