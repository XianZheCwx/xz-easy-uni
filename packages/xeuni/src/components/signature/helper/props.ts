import type { ExtractPropTypes } from "vue";

import {
  makeNumericProp,
  markStringProp,
  lieProp,
  truthProp
} from "@/utils";
import type { CanvasType } from "../types";

export const signatureProps = {
  // 画布值
  modelValue: String,
  // 画布背景颜色
  bgc: markStringProp("#FFF"),
  // 取消按钮文案
  cancelText: markStringProp("清空"),
  // 确定按钮文案
  confirmText: markStringProp("保存"),
  // 是否禁用
  disabled: lieProp,
  // 导出文件类型
  fileType: markStringProp<"jepg" | "png">("png"),
  // 画布宽度
  width: markStringProp("100%"),
  // 画布高度
  height: markStringProp("200px"),
  // 是否启用高清
  hd: truthProp,
  // 画笔宽度（大小）
  lineWidth: makeNumericProp(5),
  // 是否启用横屏
  landscape: lieProp,
  // 画笔颜色
  penColor: markStringProp("#555"),
  // 签名占位提示
  placeholder: markStringProp("滑动此处签名"),
  // 横屏签名占位提示
  placeholderLandscape: markStringProp("点击进入签名"),
  // 模式类型，默认native
  type: markStringProp<CanvasType>("native"),
  // 签名提示贴士
  tip: String,
  // 签名提示贴士
  tipColor: markStringProp("#9D9D9D"),
  // 是否显示清除按钮
  showClearBtn: truthProp,
  // 是否显示保存按钮
  showSaveBtn: truthProp,
  // 画布优先层级
  zIndex: makeNumericProp(9)
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
