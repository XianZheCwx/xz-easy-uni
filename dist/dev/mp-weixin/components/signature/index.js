"use strict";
const common_vendor = require("../../common/vendor.js");
const components_signature_hook_signature = require("./hook/signature.js");
const components_signature_helper_signature = require("./helper/signature.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  props: {
    // 画布值
    modelValue: {
      type: String,
      default: ""
    },
    // 画布背景颜色
    backgroundColor: {
      type: String,
      default: "#FFF"
    },
    // 取消按钮文案
    cancelText: {
      type: String,
      default: "清空"
    },
    // 确定按钮文案
    confirmText: {
      type: String,
      default: "保存"
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 导出文件类型
    fileType: {
      type: String,
      default: "png"
    },
    // 画布宽度
    width: {
      type: String,
      default: "100%"
    },
    // 画布高度
    height: {
      type: String,
      default: "200px"
    },
    // 是否启用高清
    hd: {
      type: Boolean,
      default: true
    },
    // 画笔宽度（大小）
    lineWidth: {
      type: Number,
      default: 5
    },
    // 是否启用横屏
    landscape: {
      type: Boolean,
      default: false
    },
    // 画笔颜色
    penColor: {
      type: String,
      default: "#000"
    },
    // 签名占位提示
    placeholder: {
      type: String,
      default: "滑动此处签名"
    },
    // 横屏签名占位提示
    placeholderLandscape: {
      type: String,
      default: "点击进入签名"
    },
    // 模式类型，默认webgl
    type: {
      type: String,
      default: "native"
    },
    // 签名提示贴士
    tip: {
      type: String,
      default: ""
    },
    // 是否显示清除按钮
    showClearBtn: {
      type: Boolean,
      default: true
    },
    // 是否显示保存按钮
    showSaveBtn: {
      type: Boolean,
      default: true
    },
    // 画布优先层级
    zIndex: {
      type: Number,
      default: 9
    }
  },
  emits: [
    "update:modelValue",
    "save",
    "clear",
    "start",
    "end",
    "signing",
    "landscape"
  ],
  setup(__props, { expose, emit: $emits }) {
    const $props = __props;
    common_vendor.useCssVars((_ctx) => ({
      "03144bf6": $props.zIndex,
      "210d22f0": $props.width,
      "34352eb6": $props.height,
      "6c9aa5d2": $props.backgroundColor,
      "5a9619b4": common_vendor.unref(placeholderContext).zindex
    }));
    let signature;
    const { $refs, $state, landscapeOpts } = components_signature_hook_signature.useSignature({
      __init__,
      signature: () => signature
    });
    const nuFileType = common_vendor.computed(() => {
      if (/^(png|jepg)$/.test($props.fileType)) {
        return $props.fileType;
      }
      console.warn(`不支持${$props.fileType}文件类型`);
      return "png";
    });
    const nuCanvasType = common_vendor.computed(() => {
      if (["native"].includes($props.type)) {
        return "";
      }
      return $props.type;
    });
    const showPlaceholder = common_vendor.computed(() => {
      return !!$state.emptyCanvas && !$props.disabled;
    });
    const placeholderContext = common_vendor.computed(() => {
      let text = $props.landscape ? $props.placeholder : $props.placeholderLandscape;
      if (landscapeOpts.show) {
        text = $props.placeholder;
      }
      return { zindex: $props.zIndex + 1, text };
    });
    const operationContext = common_vendor.computed(() => {
      const context = {
        save: $props.showSaveBtn,
        clear: $props.showClearBtn,
        show: $props.showSaveBtn || $props.showClearBtn
      };
      if ($props.landscape && !landscapeOpts.show) {
        Object.assign(context, { show: false });
      }
      return context;
    });
    function overturnSwitch(base64, direction) {
      return new Promise((resolve) => {
        common_vendor.nextTick$1(async () => {
          await signature.clear();
          await signature.reset();
          await signature.drawImage(base64, direction);
          resolve();
        });
      });
    }
    function drawEvent(e, isstart) {
      var _a;
      if ($props.disabled) {
        return;
      }
      if ($props.landscape && !landscapeOpts.show) {
        common_vendor.index.showLoading({ title: "请稍等~", mask: true });
        landscapeOpts.show = true;
        overturnSwitch($props.modelValue, "right");
        common_vendor.index.hideLoading();
        $emits("landscape", landscapeOpts.show);
        return;
      }
      const { x, y } = (_a = e == null ? void 0 : e.touches) == null ? void 0 : _a[0];
      $state.emptyCanvas = false;
      signature.execute(x, y);
      if (isstart) {
        return $emits("start", e);
      }
      $emits("signing", e);
    }
    function drawEndEvent(e) {
      signature.reset(true);
      $emits("end", e);
    }
    async function saveEvent() {
      await common_vendor.index.showLoading({ title: "正在保存中~", mask: true });
      if ($props.landscape) {
        const lbase64 = await signature.save();
        landscapeOpts.show = false;
        $emits("landscape", landscapeOpts.show);
        await overturnSwitch(lbase64, "left");
      }
      const base64 = await signature.save();
      common_vendor.index.hideLoading();
      $emits("save", base64);
      $emits("update:modelValue", base64);
    }
    function clearEvent() {
      signature.clear();
      $emits("clear");
    }
    function execute() {
      common_vendor.watchEffect(() => {
        if (!$props.modelValue || signature.saveOutStatus) {
          return;
        }
        $state.emptyCanvas = false;
        signature.drawImage($props.modelValue);
      });
    }
    function __init__() {
      const conf = () => ({
        self: $refs.self,
        uidCanvas: $state.uidCanvas,
        fileType: nuFileType.value,
        hd: $props.hd,
        style: {
          penColor: $props.penColor,
          lineWidth: $props.lineWidth
        }
      });
      switch ($props.type) {
        case "2d":
          console.group("xzTip: signature获取2d实例");
          signature = new components_signature_helper_signature.DrawSignature2D(conf);
          break;
        default:
          console.group("xzTip: signature获取2d实例");
          signature = new components_signature_helper_signature.DrawSignature(conf);
      }
    }
    expose({
      saveEvent,
      clearEvent
    });
    common_vendor.onMounted(() => {
      execute();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.unref($state).uidCanvas,
        b: common_vendor.unref(nuCanvasType),
        c: common_vendor.unref($state).uidCanvas,
        d: $props.disabled ? 1 : "",
        e: common_vendor.o(($event) => drawEvent($event, true)),
        f: common_vendor.o(drawEvent),
        g: common_vendor.o(drawEndEvent),
        h: common_vendor.unref(showPlaceholder)
      }, common_vendor.unref(showPlaceholder) ? {
        i: common_vendor.t(common_vendor.unref(placeholderContext).text)
      } : {}, {
        j: $props.tip
      }, $props.tip ? {
        k: common_vendor.t($props.tip)
      } : {}, {
        l: common_vendor.unref(operationContext).show
      }, common_vendor.unref(operationContext).show ? common_vendor.e({
        m: common_vendor.unref(operationContext).clear
      }, common_vendor.unref(operationContext).clear ? {
        n: common_vendor.t($props.cancelText),
        o: $props.disabled,
        p: common_vendor.o(clearEvent)
      } : {}, {
        q: common_vendor.unref(operationContext).save
      }, common_vendor.unref(operationContext).save ? {
        r: common_vendor.t($props.confirmText),
        s: $props.disabled,
        t: common_vendor.o(saveEvent)
      } : {}) : {}, {
        v: common_vendor.unref(landscapeOpts).show ? 1 : "",
        w: common_vendor.s(_ctx.__cssVars())
      });
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-c8eefa31"], ["__file", "E:/数据库/工程项目/开发/Web/开源项目/xzEasyUni/src/components/signature/index.vue"]]);
wx.createComponent(Component);
