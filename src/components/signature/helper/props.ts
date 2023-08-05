import type { PropType, ExtractPropTypes } from "vue";

import type { CanvasType } from "./signature";

export const signatureProps = {
  // 画布值
  modelValue: { type: String, default: "" },
  // 画布背景颜色
  bgc: { type: String, default: "#FFF" },
  // 取消按钮文案
  cancelText: { type: String, default: "清空" },
  // 确定按钮文案
  confirmText: { type: String, default: "保存" },
  // 是否禁用
  disabled: { type: Boolean, default: false },
  // 导出文件类型
  fileType: { type: String as PropType<"png" | "jepg">, default: "png" },
  // 画布宽度
  width: { type: String, default: "100%" },
  // 画布高度
  height: { type: String, default: "200px" },
  // 是否启用高清
  hd: { type: Boolean, default: true },
  // 画笔宽度（大小）
  lineWidth: { type: Number, default: 5 },
  // 是否启用横屏
  landscape: { type: Boolean, default: false },
  // 画笔颜色
  penColor: { type: String, default: "#000" },
  // 签名占位提示
  placeholder: { type: String, default: "滑动此处签名" },
  // 横屏签名占位提示
  placeholderLandscape: { type: String, default: "点击进入签名" },
  // 模式类型，默认webgl
  type: { type: String as PropType<CanvasType>, default: "native" },
  // 签名提示贴士
  tip: { type: String, default: "" },
  // 是否显示清除按钮
  showClearBtn: { type: Boolean, default: true },
  // 是否显示保存按钮
  showSaveBtn: { type: Boolean, default: true },
  // 画布优先层级
  zIndex: { type: Number, default: 9 }
} as const;


export const signatureEmits = [
  "update:modelValue",
  "save",
  "clear",
  "start",
  "end",
  "signing",
  "landscape"
];

export type SignatureProps = ExtractPropTypes<typeof signatureProps>;
