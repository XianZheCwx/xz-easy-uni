"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/index/index.js";
  "./demo-pages/signature/index.js";
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "App",
  setup(__props) {
    common_vendor.onLaunch(() => {
      console.log("App Launch");
    });
    common_vendor.onShow(() => {
      console.log("App Show");
    });
    common_vendor.onHide(() => {
      console.log("App Hide");
    });
    return () => {
    };
  }
});
const App = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "E:/数据库/工程项目/开发/Web/开源项目/xzEasyUni/src/App.vue"]]);
const components = [];
const asyncComponents = [
  {
    name: "demo-item",
    component: common_vendor.defineAsyncComponent()
  }
];
function createApp() {
  const app = common_vendor.createSSRApp(App);
  for (let com of components.concat(asyncComponents)) {
    app.component(com.name, com);
  }
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
