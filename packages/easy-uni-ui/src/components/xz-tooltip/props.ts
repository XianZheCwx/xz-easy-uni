import type { ExtractPropTypes } from "vue";

import {
  lieProp, truthProp,
  makeRequiredProp,
  makeStringProp,
  makeNumericProp
} from "@/utils/props";
import type { XzTooltipDirection } from "@/components/xz-tooltip/type";

export const xzTooltipProps = {
  // 提示内容
  tips: makeRequiredProp(String),
  // 提示气泡宽度，若宽度未指定，则尝试自动计算宽度
  width: String,
  // 显示位置
  direction: makeStringProp<XzTooltipDirection>("top"),
  // autoClose为true情况下，提示气泡显示持续时间
  duration: makeNumericProp(3000),
  // 长按持续时间
  longpressDuration: makeNumericProp(500),
  // 超出指定行数进行文本省略，默认为3行
  lineHidden: makeNumericProp(3),
  // 文字颜色
  color: makeStringProp("#FFF"),
  // 背景颜色
  bgc: makeStringProp("#6C6C6C"),
  // 提示文字对齐方式
  textAlign: makeStringProp("left"),
  // 是否显示
  show: truthProp,
  // 是否小方角样式
  square: lieProp,
  // 是否显示边框
  border: truthProp,
  // 是否自动关闭提示气泡
  autoClose: truthProp,
  // 是否启用长按
  longpress: lieProp
};

export const xzTooltipEmits = [
  "close", "open"
];

export type XzTooltipProps = ExtractPropTypes<typeof xzTooltipProps>;
