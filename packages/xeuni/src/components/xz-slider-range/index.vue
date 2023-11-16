<template>
  <view :class="{ 'slider-range--disabled': $props.disabled }"
        class="slider-range">
    <view class="slider-range__inner">
      <!-- 滑动条 -->
      <view class="slider-range__bar">
        <view :style="{ backgroundColor: $props.bgc }" class="slider-range__bar-bg" />
        <view :style="sliderRangeStyle.activeBarStyle" class="slider-range__bar-active" />
      </view>
      <view v-for="(item, index) in sliderBlockCtx.blocks" :key="index"
            class="slider-range__controls"
            :style="item.style">
        <!-- 滑块值提示 -->
        <view v-if="sliderBlockCtx.showHint" class="slider-range__hint">{{ item.hint }}</view>
        <!-- 滑块 -->
        <view :class="{'slider-range__block--decoration': sliderBlockCtx.decoration}"
              class="slider-range__block"
              @touchstart="_onTouchStart"
              @touchmove="blockEvent($event, index)" />
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
  /*
   * 组件名: slider-range
   * 组件用途: 范围滑块组件
   * 创建日期: 2023/5/18
   * 编写者: XianZhe
   */
  import { computed, reactive, onMounted, getCurrentInstance } from "vue";

  import { silderRangeProps, silderRangeEmits } from "./helper/props";
  import type { SliderBlockCtx } from "./types";
  import { getRect, type NodeInfo } from "@/utils/dom";

  const $refs = reactive({
    self: getCurrentInstance()
  });
  const $props = defineProps(silderRangeProps);
  const $emits = defineEmits(silderRangeEmits);
  const $state = reactive({
    values: [$props.min, $props.max],
    rect: {} as NodeInfo
  });

  // 滑块值提示
  const nuValueHint = computed(() => {
    let [left, right] = $state.values;
    // 重叠控制
    const overlap = right - left <= $props.step ?? right === left;

    return { left, right, overlap };
  });

  const sliderBlockCtx = computed<SliderBlockCtx>(() => {
    const [lower, higher] = $state.values;
    const lp = getPercent(lower, $props.min) + "%";
    const rp = getPercent(higher, $props.min) + "%";

    let lhint: string | number = lower, rhint: string | number = higher;
    // 自定义格式化
    if ($props.format && $props.format instanceof Function) {
      lhint = $props.format(lhint);
      rhint = $props.format(rhint);
    }

    const blocks: SliderBlockCtx["blocks"] = [{
      hint: lhint,
      style: {
        left: lp
      }
    }];
    if (!$props.solo) {
      blocks.push({
        hint: rhint,
        style: {
          left: rp
        }
      });
    }

    return { blocks, showHint: $props.hint, decoration: $props.decoration };
  });

  const sliderRangeStyle = computed(() => {
    const [lower, higher] = $state.values;
    const barPadding = $props.size / 2 + "px";
    const activeBarStyle = {
      width: getPercent(higher, lower) + "%",
      left: getPercent(lower, $props.min) + "%"
    };

    return {
      barPadding, activeBarStyle,
      blockSize: $props.size + "px"
    };
  });

  function blockEvent(e: TouchEvent, index: number) {
    const { pageX } = e?.touches?.[e?.touches.length - 1];
    const { left, width } = $state.rect;
    if (left && width) {
      const target = Math.round(getPercent(pageX, left, width)) * $props.step;

      switch (true) {
        // 过大处理
        case pageX >= left + width:
          $state.values[index] = $props.max;
          break;
        // 高值不低于底值限制
        case index !== 0 && target <= $state.values[0]:
          break;
        case pageX >= left:
          $state.values[index] = target;
      }
      $emits("update:modelValue", $state.values);
      $emits("change", $state.values);
    }
  }

  function getPercent(higher: number, lower: number = 0, total = $props.max - $props.min) {
    return (higher - lower) / total * 100;
  }

  function reset() {

  }

  async function execute() {
    $state.rect = await getRect(".slider-range__inner", $refs.self);

    if ($props.modelValue && Array.isArray($props.modelValue) && $props.modelValue.length >= 2) {
      $state.values = $props.modelValue;
    }
    $emits("update:modelValue", $state.values);
  }

  defineExpose({
    reset
  });

  onMounted(() => {
    execute();
  });
</script>

<style lang="scss" scoped>
  @import "./scss/slider-range";

  .slider-range {
    padding: 0 v-bind("sliderRangeStyle.barPadding");

    &__bar {
      height: v-bind("$props.height");

      &-active {
        background-color: v-bind("$props.activeColor");
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
