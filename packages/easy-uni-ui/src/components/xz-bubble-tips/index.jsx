// Taro2.x
import Taro, { useState, useCallback } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";

import "./index.scss";
import { dynamicClass } from "../../utils/xzHelper";

let timer = null;

/*
 * 组件名: XzBubbleTips
 * 组件用途: 文字气泡提示
 * 创建日期: 2024/4/20
 * 编写者: XianZhe
 */
const XzBubbleTips = (props) => {
  const {
    children,
    tips,
    direction = "bottom",
    duration = 3000
  } = props;
  const [$state, setState] = useState({
    show: false
  });

  function tipsEvent(show = !$state.show) {
    setState({ show });
    timer && clearTimeout(timer);
    if (show) {
      timer = setTimeout(() => {
        setState({ show: false });
      }, duration);
    }
  }

  return (
    <View className={dynamicClass({
      "xz-bubble-tips": true,
      "xz-bubble-tips--bottom": /^bottom$/i.test(direction),
      "xz-bubble-tips--bottom-left": /^bottom-left$/i.test(direction),
      "xz-bubble-tips--right": /^right/i.test(direction),
    })}>
      <View className="xz-bubble-tips__main" onClick={() => tipsEvent()}>{children}</View>
      <View className="xz-bubble-tips__tips"
            style={{ display: $state.show ? "block" : "none" }}
            onClick={() => tipsEvent()}>{tips}</View>
    </View>
  );
};

export default XzBubbleTips;
