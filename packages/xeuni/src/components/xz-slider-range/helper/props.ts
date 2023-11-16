import type { ExtractPropTypes } from "vue";

import {
  lieProp,
  truthProp,
  makeFuncProp,
  makeNumberProp,
  makeRequiredProp,
  makeStringProp
} from "@/utils/props";

export const silderRangeProps = {
  modelValue: makeRequiredProp(Array),
  // 最小值
  min: makeNumberProp(0),
  // 最大值
  max: makeNumberProp(100),
  // 步进
  step: makeNumberProp(1),
  // 滑块值格式化回调
  format: makeFuncProp<((val: number) => string) | undefined>(undefined),
  // 是否为禁用状态
  disabled: lieProp,
  // 滑块大小
  size: makeNumberProp(26),
  // 滑块颜色
  color: makeStringProp("#FFF"),
  // 背景条颜色
  bgc: makeStringProp("#E9E9E9"),
  // 已选择的颜色
  activeColor: makeStringProp("#1AAD19"),
  // 区间进度条高度
  height: makeStringProp("5px"),
  // 是否显示滑块值提示文本
  hint: truthProp,
  // 提示文本大小
  hintSize: makeStringProp("12px"),
  // 提示文本颜色
  hintColor: makeStringProp("#666"),
  // 是否显示滑块内装饰元素
  decoration: truthProp,
  // 是否为单区间模式
  solo: lieProp
};

export const silderRangeEmits = [
  "update:modelValue", "change"
];

export type SilderRangeProps = ExtractPropTypes<typeof silderRangeProps>
