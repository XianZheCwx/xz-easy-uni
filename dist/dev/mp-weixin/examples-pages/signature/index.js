"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Math) {
  common_vendor.unref(Signature)();
}
const Signature = () => "../../components/signature/index.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  props: {},
  emits: [],
  setup(__props, { emit: $emits }) {
    common_vendor.reactive({});
    const signature_1 = common_vendor.reactive({
      val: ""
    });
    common_vendor.onMounted(() => {
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(($event) => signature_1.val = $event),
        b: common_vendor.p({
          landscape: true,
          type: "2d",
          modelValue: signature_1.val
        })
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-dcc0c74b"], ["__file", "E:/数据库/工程项目/开发/Web/开源项目/xzEasyUni/src/examples-pages/signature/index.vue"]]);
wx.createPage(MiniProgramPage);
