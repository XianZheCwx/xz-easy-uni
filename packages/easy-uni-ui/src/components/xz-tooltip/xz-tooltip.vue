<script setup lang="ts">
  /*
   * 组件名: xz-tooltip
   * 组件用途: 文字提示气泡
   * 创建日期: 2024/5/10
   * 编写者: XianZhe
   */
  import { useXzTooltip } from "./hook";
  import { xzTooltipProps, xzTooltipEmits } from "./props";

  const $props = defineProps(xzTooltipProps);
  const $emits = defineEmits(xzTooltipEmits);
  const {
    nuShow, xzTooltipStyle,
    tipsEvent, tipsStartEvent, tipsEndEvent
  } = useXzTooltip($props, $emits);

  defineExpose({
    switch: tipsEvent
  });

</script>

<template>
  <view class="xz-tooltip"
        :style="{
          '--xz-tooltip--bgc': $props.bgc,
          '--xz-tooltip--color': $props.color,
          '--xz-tooltip--triangle-pos': xzTooltipStyle.trianglePos,
        }"
        :class="{
          'xz-tooltip--border': $props.border,
          'xz-tooltip--square': $props.square,
          // 控制方位样式类👇
          'xz-tooltip--top': /^top$/i.test($props.direction),
          'xz-tooltip--top-start': /^top-start$/i.test($props.direction),
          'xz-tooltip--top-end': /^top-end$/i.test($props.direction),
          'xz-tooltip--bottom': /^bottom$/i.test($props.direction),
          'xz-tooltip--bottom-start': /^bottom-start$/i.test($props.direction),
          'xz-tooltip--bottom-end': /^bottom-end$/i.test($props.direction),
          'xz-tooltip--left': /^left$/i.test($props.direction),
          'xz-tooltip--left-start': /^left-start$/i.test($props.direction),
          'xz-tooltip--left-end': /^left-end$/i.test($props.direction),
          'xz-tooltip--right': /^right$/i.test($props.direction),
          'xz-tooltip--right-start': /^right-start$/i.test($props.direction),
          'xz-tooltip--right-end': /^right-end$/i.test($props.direction),
        }"
        @touch-start="tipsStartEvent"
        @touch-end="tipsEndEvent"
        @click="tipsEvent">
    <view class="xz-tooltip__main">
      <slot name="default" />
    </view>
    <view :style="{display: nuShow ? 'block' : 'none'}"
          class="xz-tooltip__tips">
      <slot name="tips">
        <text>{{ $props.tips }}</text>
      </slot>
    </view>
  </view>
</template>

<style lang="scss" scoped src="./scss/index.scss" />
<style lang="scss" scoped>
  .xz-tooltip {
    &__tips {
      width: v-bind("xzTooltipStyle.width");
      text-align: v-bind("xzTooltipStyle.textAlign");
    }
  }
</style>
