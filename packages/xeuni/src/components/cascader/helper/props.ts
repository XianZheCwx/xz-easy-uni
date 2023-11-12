import type { ExtractPropTypes } from "vue";
import type {
  CascaderType,
  CascaderAdvancedProps
} from "../types";

import {
  truthProp,
  numericProp,
  makeNumericProp,
  makeObjectProp,
  makeStringProp,
  makeRequiredProp,
  makeArrayProp
} from "@/utils";

export const cascaderProps = {
  // v-model:当前选中项标识
  modelValue: numericProp,
  // 是否显示弹出层
  show: makeRequiredProp(Boolean),
  // 主题颜色
  color: makeStringProp("#2894FF"),
  // 弹出层类型
  type: makeStringProp<CascaderType>("bottom"),
  // 级联高级配置项
  props: makeObjectProp<CascaderAdvancedProps>({}),
  // 数据源
  options: makeArrayProp<Node[]>([]),
  // 是否显示关闭图标
  close: truthProp,
  // 关闭icon类型
  closeIcon: makeStringProp("closeempty"),
  // 弹出层标题
  title: makeStringProp("请选择"),
  // 项右侧图标
  ricon: String,
  // 层级优先级
  zindex: makeNumericProp(99),
  // 面包屑未选中提示文案
  placeholder: makeStringProp("请选择")
};

export const cascaderEmits = [
  "update:show", "update:modelValue",
  "close", "open", "comfrim",
  "cancel", "clickTab", "finish",
  "change", "checked"
];

export type CascaderProps = ExtractPropTypes<typeof cascaderProps>;
