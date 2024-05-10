<template>
  <view :class="{ 'xz-slider-range--disabled': $props.disabled }"
        class="xz-slider-range">
    <view class="xz-slider-range__inner">
      <!-- 滑动条 -->
      <view class="xz-slider-range__bar">
        <view class="xz-slider-range__bar-bg" />
        <view :style="sliderRangeStyle.activeBarStyle" class="xz-slider-range__bar-active" />
      </view>
      <view v-for="(item, index) in sliderBlockCtx.blocks" :key="index"
            :style="item.style"
            class="xz-slider-range__controls"
            @touchmove="blockEvent($event, index)">
        <!-- 滑块值提示 -->
        <view v-if="item.showHint"
              :class="{
                'xz-slider-range__hint--top': /^top$/.test($props.hintMode),
                'xz-slider-range__hint--bottom': /^bottom$/.test($props.hintMode),
                'xz-slider-range__hint--insert': /^insert$/.test($props.hintMode),
                'xz-slider-range__hint--toast': /^toast$/.test($props.hintMode)
              }"
              class="xz-slider-range__hint">
          <text>{{ item.hint }}</text>
        </view>
        <!-- 滑块 -->
        <view :class="{'xz-slider-range__block--decoration': sliderBlockCtx.decoration}"
              class="xz-slider-range__block" />
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
  /*
   * 组件名: xz-slider-range
   * 组件用途: 范围滑块组件
   * 创建日期: 2023/5/18
   * 编写者: XianZhe
   */
  import { silderRangeProps, silderRangeEmits } from "./props";
  import { useSliderRange } from "./hook";

  const $props = defineProps(silderRangeProps);
  const $emits = defineEmits(silderRangeEmits);
  const {
    sliderRangeStyle,
    sliderBlockCtx,
    blockEvent,
    reset
  } = useSliderRange($props, $emits);

  defineExpose({
    reset
  });

</script>

<style lang="scss" scoped src="./scss/index.scss" />
<style lang="scss" scoped>
  .xz-slider-range {
    padding: 0 v-bind("sliderRangeStyle.barPadding");

    &__bar {
      height: v-bind("$props.height");

      &-bg {
        background-color: v-bind("$props.bgc");
      }

      &-active {
        background-color: v-bind("$props.activeBgc");
      }
    }

    &__block {
      width: v-bind("sliderRangeStyle.blockSize");
      height: v-bind("sliderRangeStyle.blockSize");
      background-color: v-bind("$props.color");
    }

    &__hint {
      font-size: v-bind("$props.hintSize");
      color: v-bind("$props.hintColor");
    }
  }

</style>
