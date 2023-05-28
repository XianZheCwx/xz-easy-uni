<template>
  <view :class="{ disabled: $props.disabled }" :style="{ paddingLeft: blockSize / 2 + 'px', paddingRight: blockSize / 2 + 'px' }" class="slider-range">
    <view class="slider-range-inner" :style="{ height: height + 'px' }">
      <view class="slider-bar" :style="{ height: barHeight + 'px' }">
        <!-- 背景条 -->
        <view :style="{ backgroundColor: backgroundColor }" class="slider-bar-bg" />
        <!-- 滑块实际区间 -->
        <view
          :style="{
            width: (($state.values[1] - $state.values[0]) / (max - min)) * 100 + '%',
            left: lowerHandlePosition + '%'
          }"
          class="slider-bar-inner"
        />
      </view>
      <!-- 滑动块-左 -->
      <view
        class="slider-handle-block"
        :class="{ decoration: decorationVisible }"
        :style="{ left: lowerHandlePosition + '%' }"
        data-tag="lowerBlock"
        @touchstart="_onTouchStart"
        @touchmove="_onBlockTouchMove"
        @touchend="_onBlockTouchEnd"
      />
      <!-- 滑动块-右 -->
      <view
        class="slider-handle-block"
        :class="{ decoration: decorationVisible }"
        :style="{ left: higherHandlePosition + '%' }"
        data-tag="higherBlock"
        @touchstart="_onTouchStart"
        @touchmove="_onBlockTouchMove"
        @touchend="_onBlockTouchEnd"
      />
      <!-- 滑块值提示 -->
      <view v-if="tipVisible && !nuValueHint.overlap" class="range-tip" :style="lowerTipStyle">
        {{ nuValueHint?.left }}
      </view>
      <view v-if="tipVisible" class="range-tip" :style="higherTipStyle">
        {{ nuValueHint?.right }}
      </view>
    </view>
  </view>
</template>

<script setup>
  /*
   * 组件名: slider-range
   * 组件用途: 范围滑块组件
   * 创建日期: 2023/5/18
   * 编写者: XianZhe
   */
  import { computed, reactive, onMounted, getCurrentInstance } from "vue";

  const $refs = reactive({
    self: getCurrentInstance()
  });
  const $props = defineProps({
    modelValue: {
      type: Array,
      required: true
    },
    // 最小值
    min: {
      type: Number,
      default: 0
    },
    // 最大值
    max: {
      type: Number,
      default: 100
    },
    // 步进
    step: {
      type: Number,
      default: 1
    },
    // 滑块值提示文本格式化函数
    format: {
      type: Function,
      default: (val) => {
        return val;
      }
    },
    // 是否为禁用状态
    disabled: {
      type: Boolean,
      default: false
    },
    // 滑块容器高度
    height: {
      height: Number,
      default: 50
    },
    // 区间进度条高度
    barHeight: {
      type: Number,
      default: 5
    },
    // 背景条颜色
    backgroundColor: {
      type: String,
      default: "#E9E9E9"
    },
    // 已选择的颜色
    activeColor: {
      type: String,
      default: "#1AAD19"
    },
    // 滑块大小
    blockSize: {
      type: Number,
      default: 20
    },
    // 滑块颜色
    blockColor: {
      type: String,
      default: "#FFF"
    },
    // 是否显示滑块值提示文本
    tipVisible: {
      type: Boolean,
      default: true
    },
    // 是否显示滑块内装饰元素
    decorationVisible: {
      type: Boolean,
      default: false
    }
  });
  const $state = reactive({
    values: [$props.min, $props.max],
    // 开始拖动时的坐标位置
    startDragPos: 0,
    // 开始拖动时较小点的值
    startVal: 0,
    isDragging: false
  });
  const $emits = defineEmits(["update:modelValue", "change"]);

  // 滑块值提示
  const nuValueHint = computed(() => {
    let [left, right] = $state.values;
    // 重叠控制
    const overlap = right - left <= $props.step ?? right === left;

    // 自定义格式化
    if ($props.format && $props.format.constructor === Function) {
      left = $props.format(left);
      right = $props.format(right);
    }

    return { left, right, overlap };
  });

  const styleBlockSize = computed(() => {
    return $props.blockSize + "px";
  });

  // 较小点滑块的坐标
  const lowerHandlePosition = computed(() => {
    return (($state.values[0] - $props.min) / ($props.max - $props.min)) * 100;
  });

  // 较大点滑块的坐标
  const higherHandlePosition = computed(() => {
    return (($state.values[1] - $props.min) / ($props.max - $props.min)) * 100;
  });

  const lowerTipStyle = computed(() => {
    if (lowerHandlePosition.value < 90) {
      return `left: ${lowerHandlePosition.value}%;`;
    }
    return `right: ${100 - lowerHandlePosition.value}%;transform: translate(50%, -100%);`;
  });

  const higherTipStyle = computed(() => {
    if (higherHandlePosition.value < 90) {
      return `left: ${higherHandlePosition.value}%;`;
    }
    return `right: ${100 - higherHandlePosition.value}%;transform: translate(50%, -100%);`;
  });

  function _updateValue(newVal) {
    // 步长大于区间差，或者区间最大值和最小值相等情况
    if ($props.step >= $props.max - $props.min) {
      throw new RangeError("Invalid slider step or slider range");
    }

    let newValues = [];
    if (Array.isArray(newVal)) {
      newValues = newVal.slice(0, 2);
    }
    if (typeof newValues[0] !== "number") {
      newValues[0] = $state.values[0];
    } else {
      newValues[0] = Math.round((newValues[0] - $props.min) / $props.step) * $props.step + $props.min;
    }
    if (typeof newValues[1] !== "number") {
      newValues[1] = $state.values[1];
    } else {
      newValues[1] = Math.round((newValues[1] - $props.min) / $props.step) * $props.step + $props.min;
    }

    // 新值与原值相等，不做处理
    if ($state.values[0] === newValues[0] && $state.values[1] === newValues[1]) {
      return;
    }
    // 左侧滑块值小于最小值时，设置为最小值
    if (newValues[0] < $props.min) {
      newValues[0] = $props.min;
    }
    // 右侧滑块值大于最大值时，设置为最大值
    if (newValues[1] > $props.max) {
      newValues[1] = $props.max;
    }

    // 两个滑块重叠或左右交错，使两个滑块保持最小步长的间距
    if (newValues[0] >= newValues[1]) {
      if (newValues[0] === $state.values[0]) {
        newValues[1] = newValues[0] + $props.step;
      } else {
        newValues[0] = newValues[1] - $props.step;
      }
    }

    $state.values = newValues;
    $emits("update:modelValue", newValues);
    $emits("change", newValues);
  }

  function _onTouchStart(event) {
    if ($props.disabled) {
      return;
    }

    $state.isDragging = true;
    let tag = event.target.dataset.tag;

    //兼容h5平台及某版本微信
    let e = event.changedTouches ? event.changedTouches[0] : event;
    $state.startDragPos = e.pageX;

    $state.startVal = tag === "lowerBlock" ? $state.values[0] : $state.values[1];
  }

  function _onBlockTouchMove(e) {
    if ($props.disabled) {
      return;
    }
    _onDrag(e);
  }

  function _onBlockTouchEnd(e) {
    if ($props.disabled) {
      return;
    }
    $state.isDragging = false;
    _onDrag(e);
  }

  function _onDrag(event) {
    if (!$state.isDragging) {
      return;
    }
    const view = uni.createSelectorQuery().in($refs.self).select(".slider-range-inner");

    view
      .boundingClientRect((data) => {
        let sliderWidth = data.width;
        const tag = event.target.dataset.tag;
        let e = event.changedTouches ? event.changedTouches[0] : event;
        let diff = ((e.pageX - $state.startDragPos) / sliderWidth) * ($props.max - $props.min);
        let nextVal = $state.startVal + diff;

        if (tag === "lowerBlock") {
          _updateValue([nextVal, null]);
        } else {
          _updateValue([null, nextVal]);
        }
      })
      .exec();
  }

  function isValuesValid(values) {
    return Array.isArray(values) && values.length === 2;
  }

  function execute() {
    if ($props.modelValue && Array.isArray($props.modelValue) && $props.modelValue.length >= 2) {
      $state.values = $props.modelValue;
    }
    $emits("update:modelValue", $state.values);
  }

  defineExpose({
    isValuesValid
  });

  onMounted(() => {
    execute();
  });
</script>

<style lang="scss" scoped>
  .slider-range {
    position: relative;
    padding-top: 40rpx;

    &.disabled {
      .slider-bar-inner {
        opacity: 0.35;
      }

      .slider-handle-block {
        cursor: not-allowed;
        opacity: 0.8;
      }
    }

    .slider-range-inner {
      position: relative;
      width: 100%;
    }
  }

  .slider-bar {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    transform: translateY(-50%);

    &-bg {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 10000px;
      z-index: 10;
    }

    &-inner {
      position: absolute;
      width: 100%;
      height: 100%;
      background-color: v-bind("$props.activeColor");
      border-radius: 10000px;
      z-index: 11;
    }
  }

  .slider-handle-block {
    width: v-bind(styleBlockSize);
    height: v-bind(styleBlockSize);
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    border: 1px solid #e3e5f100;
    background-color: v-bind("$props.blockColor");
    box-shadow: -1px 3px 3px #adadad;
    z-index: 2;
    cursor: pointer;

    &.decoration {
      &::before,
      &::after {
        position: absolute;
        content: "";
        width: 6upx;
        height: 24upx;
        top: 50%;
        left: 29%;
        transform: translateY(-50%);
        background: #adadad;
        border-radius: 3upx;
      }

      &::after {
        left: initial;
        right: 29%;
      }
    }
  }

  .range-tip {
    position: absolute;
    top: 0;
    font-size: 24upx;
    color: #666;
    transform: translate(-50%, -100%);
  }
</style>
