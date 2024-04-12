import type { ExtractPropTypes } from "vue";

import {
  makeRequiredProp,
  makeStringProp,
  makeObjectProp
} from "@/utils/props";

export const cellProps = {
  // 标题
  lable: makeRequiredProp(String),
  // 右侧图表
  icon: makeStringProp("right"),
  // 点击跳转
  to: String,
  // 单元格高度
  height: makeStringProp("80rpx"),
  // 单元格背景色
  bgc: makeStringProp("#FFF"),
  // 单元格激活状态背景色
  activeBgc: makeStringProp("#F3F3F3"),
  // 单元格样式
  style: makeObjectProp({ marginBottom: "22rpx" }),
  // 阴影颜色
  shadow: makeStringProp("#F0F0F0")
};

export type CellProps = ExtractPropTypes<typeof cellProps>
