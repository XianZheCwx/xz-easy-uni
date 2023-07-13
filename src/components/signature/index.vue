<template>
  <view
    :class="{ 'signature--landscape': landscapeOpts.show }"
    class="signature">
    <view class="signature__main">
      <canvas
        :id="$state.uidCanvas"
        hidpi
        disable-scroll
        :type="nuCanvasType"
        :canvas-id="$state.uidCanvas"
        :class="{ 'signature__canvas--disabled': $props.disabled }"
        class="signature__canvas"
        @touchstart="drawEvent($event, true)"
        @touchmove="drawEvent"
        @touchend="drawEndEvent" />
      <!-- 内容占位 -->
      <view
        v-if="showPlaceholder"
        class="signature__placeholder">
        <text>{{ placeholderContext.text }}</text>
      </view>
    </view>
    <view class="signature__operation">
      <view class="signature__tip">
        <slot name="tip">
          <text v-if="$props.tip">{{ $props.tip }}</text>
        </slot>
      </view>
      <view
        v-if="operationContext.show"
        class="signature__btn-container">
        <button
          v-if="operationContext.clear"
          size="mini"
          class="signature__btn"
          :disabled="$props.disabled"
          @click.stop="clearEvent">
          {{ $props.cancelText }}
        </button>
        <button
          v-if="operationContext.save"
          size="mini"
          type="primary"
          class="signature__btn"
          :disabled="$props.disabled"
          @click.stop="saveEvent">
          {{ $props.confirmText }}
        </button>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
  /*
   * 组件名: signature
   * 组件用途: 签名组件（只用于签名）
   * 创建日期: 2023/5/26
   * 编写者: XianZhe
   */
  import { computed, onMounted, watchEffect, nextTick } from "vue";
  import type { PropType } from "vue";

  import { useSignature } from "./hook/signature";
  import { DrawSignature, DrawSignature2D, CanvasType } from "./helper/signature";

  type UniTouchEvent = TouchEvent & { touches: (Touch & { x: number; y: number })[] };

  // 签名绘制实例
  let signature: DrawSignature2D | DrawSignature;
  const { $refs, $state, landscapeOpts } = useSignature({
    __init__,
    signature: () => signature
  });
  const $props = defineProps({
    // 画布值
    modelValue: {
      type: String,
      default: ""
    },
    // 画布背景颜色
    backgroundColor: {
      type: String,
      default: "#F0F0F0"
    },
    // 取消按钮文案
    cancelText: {
      type: String,
      default: "清空"
    },
    // 确定按钮文案
    confirmText: {
      type: String,
      default: "保存"
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 导出文件类型
    fileType: {
      type: String as PropType<"png" | "jepg">,
      default: "png"
    },
    // 画布宽度
    width: {
      type: String,
      default: "100%"
    },
    // 画布高度
    height: {
      type: String,
      default: "200px"
    },
    // 是否启用高清
    hd: {
      type: Boolean,
      default: true
    },
    // 画笔宽度（大小）
    lineWidth: {
      type: Number,
      default: 5
    },
    // 是否启用横屏
    landscape: {
      type: Boolean,
      default: false
    },
    // 画笔颜色
    penColor: {
      type: String,
      default: "#000"
    },
    // 签名占位提示
    placeholder: {
      type: String,
      default: "滑动此处签名"
    },
    // 横屏签名占位提示
    placeholderLandscape: {
      type: String,
      default: "点击进入签名"
    },
    // 模式类型，默认webgl
    type: {
      type: String as PropType<CanvasType>,
      default: "native"
    },
    // 签名提示贴士
    tip: {
      type: String,
      default: ""
    },
    // 是否显示清除按钮
    showClearBtn: {
      type: Boolean,
      default: true
    },
    // 是否显示保存按钮
    showSaveBtn: {
      type: Boolean,
      default: true
    },
    // 画布优先层级
    zIndex: {
      type: Number,
      default: 9
    }
  });
  const $emits = defineEmits([
    "update:modelValue",
    "save",
    "clear",
    "start",
    "end",
    "signing",
    "landscape"
  ]);

  // 强制标准文件类型
  const nuFileType = computed<"png" | "jepg">(() => {
    if (/^(png|jepg)$/.test($props.fileType)) {
      return $props.fileType;
    }
    console.warn(`不支持${$props.fileType}文件类型`);
    return "png";
  });

  const nuCanvasType = computed(() => {
    if (["native"].includes($props.type)) {
      return "";
    }
    return $props.type;
  });

  const showPlaceholder = computed<boolean>(() => {
    return !!$state.emptyCanvas && !$props.disabled;
  });

  // 占位符上下文控制
  const placeholderContext = computed<{ text: string; zindex: number }>(() => {
    let text = $props.landscape ? $props.placeholder : $props.placeholderLandscape;
    if (landscapeOpts.show) {
      text = $props.placeholder;
    }
    return { zindex: $props.zIndex + 1, text };
  });

  // 操作上下文控制
  const operationContext = computed(() => {
    const context = {
      save: $props.showSaveBtn,
      clear: $props.showClearBtn,
      show: $props.showSaveBtn || $props.showClearBtn
    };
    if ($props.landscape && !landscapeOpts.show) {
      Object.assign(context, { show: false });
    }
    return context;
  });

  // 横竖屏切换
  function overturnSwitch(base64: string, direction?: "left" | "right") {
    return new Promise<void>((resolve) => {
      // 需要DOM切换完毕后获取宽高
      nextTick(async () => {
        await signature.clear();
        await signature.reset();
        await signature.drawImage(base64, direction);
        resolve();
      });
    });
  }

  function drawEvent(e: UniTouchEvent, isstart: boolean) {
    // 禁用状态
    if ($props.disabled) {
      return;
    }
    // 开启横屏且画布转换
    if ($props.landscape && !landscapeOpts.show) {
      uni.showLoading({ title: "请稍等~", mask: true });
      landscapeOpts.show = true;
      overturnSwitch($props.modelValue, "right");

      uni.hideLoading();
      $emits("landscape", landscapeOpts.show);
      return;
    }

    const { x, y } = e?.touches?.[0];
    $state.emptyCanvas = false;
    signature.execute(x, y);

    if (isstart) {
      return $emits("start", e);
    }
    $emits("signing", e);
  }

  function drawEndEvent(e: UniTouchEvent) {
    signature.reset(true);
    $emits("end", e);
  }

  async function saveEvent() {
    await uni.showLoading({ title: "正在保存中~", mask: true });

    if ($props.landscape) {
      // 横屏画布base64
      const lbase64 = await signature.save();
      landscapeOpts.show = false;
      $emits("landscape", landscapeOpts.show);
      await overturnSwitch(lbase64, "left");
    }
    // 竖屏画布base64
    const base64 = await signature.save();
    uni.hideLoading();

    $emits("save", base64);
    $emits("update:modelValue", base64);
  }

  function clearEvent() {
    signature.clear();
    $emits("clear");
  }

  function execute() {
    watchEffect(() => {
      // 主动抛出不作为画布绘入
      if (!$props.modelValue || signature.saveOutStatus) {
        return;
      }
      $state.emptyCanvas = false;
      // 画布绘入
      signature.drawImage($props.modelValue);
    });
  }

  function __init__() {
    const conf = () => ({
      self: $refs.self,
      uidCanvas: $state.uidCanvas!,
      fileType: nuFileType.value,
      hd: $props.hd,
      style: {
        penColor: $props.penColor,
        lineWidth: $props.lineWidth
      }
    });

    // 绘制实例
    switch ($props.type) {
      case "2d":
        console.group("xzTip: signature获取2d实例");
        signature = new DrawSignature2D(conf);
        break;
      default:
        console.group("xzTip: signature获取2d实例");
        signature = new DrawSignature(conf);
    }
  }

  defineExpose({
    saveEvent,
    clearEvent
  });

  onMounted(() => {
    execute();
  });
</script>

<style lang="scss" scoped>
  @import "./scss/signature.scss";

  .signature {
    position: relative;
    z-index: v-bind("$props.zIndex");
    width: v-bind("$props.width");

    &__main {
      height: v-bind("$props.height");
    }

    &__canvas {
      background-color: v-bind("$props.backgroundColor");
    }

    &__placeholder {
      z-index: v-bind("placeholderContext.zindex");
    }
  }
</style>
