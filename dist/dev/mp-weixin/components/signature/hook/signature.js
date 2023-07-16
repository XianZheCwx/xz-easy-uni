"use strict";
const common_vendor = require("../../../common/vendor.js");
require("../helper/signature.js");
function useSignature({
  __init__,
  signature
} = {}) {
  const $refs = common_vendor.reactive({
    self: common_vendor.getCurrentInstance()
  });
  const $state = common_vendor.reactive({
    uidCanvas: `signature-${Math.trunc(Math.random() * 1e6)}`,
    emptyCanvas: true
  });
  const landscapeOpts = common_vendor.reactive({
    show: false
  });
  common_vendor.onBeforeMount(() => {
    __init__ && __init__();
  });
  common_vendor.onUnmounted(() => {
    signature == null ? void 0 : signature().killTemp();
    console.groupEnd();
  });
  return { $refs, $state, landscapeOpts };
}
exports.useSignature = useSignature;
