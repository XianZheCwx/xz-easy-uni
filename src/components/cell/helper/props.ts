import type { PropType, ExtractPropTypes } from "vue";

export const cellProps = {
  lable: { type: String, required: true },
  icon: { type: String, default: "right" },
  to: { type: String },
  height: { type: String, default: "80rpx" },
  bgc: { type: String, default: "#FFF" },
  activeBgc: { type: String, default: "#F3F3F3" },
  style: { type: Object, default: {} }
};

export type CellProps = ExtractPropTypes<typeof cellProps>
