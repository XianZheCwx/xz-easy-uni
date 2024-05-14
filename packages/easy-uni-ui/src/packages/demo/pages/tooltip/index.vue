<script setup lang="ts">
  /*
   * 组件名: tooltip
   * 组件用途: 文字提示气泡demo页
   * 创建日期: 2024/5/10
   * 编写者: XianZhe
   */
  import { computed, reactive, type ComponentPublicInstance } from "vue";

  import XzTooltip from "@/components/xz-tooltip/xz-tooltip.vue";
  import DemoItem from "@/components/demo/demo-item.vue";

  type RefComponent = Record<string, ComponentPublicInstance<Record<string, any>>[] | null>;

  const $refs: RefComponent = reactive({
    xztooltip: []
  });
  const $state = reactive({
    vertical: "uni-app在手，做啥都不愁。即使不跨端，uni-app也是更好的小程序开发框架、更好的App跨平台框架、更方便的H5开发框架。",
    horizontal: "uni-app 是一个使用 Vue.js 开发所有前端应用的框架"
  });

  function startupEvent() {
    if (!$refs.xztooltip) {
      return;
    }
    for (const instance of $refs.xztooltip) {
      instance.switch(true);
    }
  }

</script>

<template>
  <view class="tooltip-demo">
    <demo-item title="基本使用" top="40px">
      <!-- 垂直方向 -->
      <view class="tooltip-demo__vertical">
        <xz-tooltip :ref="ref => $refs.xztooltip.push(ref)"
                    :tips="$state.vertical" direction="top-start"
                    color="#FF9224" bgc="#FFF8D7">
          <uv-button text="top-start" />
        </xz-tooltip>
        <xz-tooltip :ref="ref => $refs.xztooltip.push(ref)"
                    :tips="$state.vertical" direction="top">
          <uv-button text="top" />
        </xz-tooltip>
        <xz-tooltip :ref="ref => $refs.xztooltip.push(ref)"
                    :tips="$state.vertical" direction="top-end">
          <uv-button text="top-end" />
        </xz-tooltip>
        <xz-tooltip :ref="ref => $refs.xztooltip.push(ref)"
                    :tips="$state.vertical" direction="bottom-start">
          <uv-button text="bottom-start" />
        </xz-tooltip>
        <xz-tooltip :ref="ref => $refs.xztooltip.push(ref)"
                    :tips="$state.vertical" direction="bottom">
          <uv-button text="bottom" />
        </xz-tooltip>
        <xz-tooltip :ref="ref => $refs.xztooltip.push(ref)"
                    :tips="$state.vertical" direction="bottom-end">
          <uv-button text="bottom-end" />
        </xz-tooltip>
      </view>
      <!-- 水平方向 -->
      <view class="tooltip-demo__horizontal">
        <xz-tooltip :ref="ref => $refs.xztooltip.push(ref)"
                    :tips="$state.horizontal" direction="left-start">
          <uv-button text="left-start" custom-text-style="font-size: 24rpx" />
        </xz-tooltip>
        <xz-tooltip :ref="ref => $refs.xztooltip.push(ref)"
                    :tips="$state.horizontal" direction="right-start">
          <uv-button text="right-start" custom-text-style="font-size: 24rpx" />
        </xz-tooltip>
        <xz-tooltip :ref="ref => $refs.xztooltip.push(ref)"
                    :tips="$state.horizontal" direction="left">
          <uv-button text="left" custom-text-style="font-size: 24rpx" />
        </xz-tooltip>
        <xz-tooltip :ref="ref => $refs.xztooltip.push(ref)"
                    :tips="$state.horizontal" direction="right">
          <uv-button text="right" custom-text-style="font-size: 24rpx" />
        </xz-tooltip>
        <xz-tooltip :ref="ref => $refs.xztooltip.push(ref)"
                    :tips="$state.horizontal" direction="left-end">
          <uv-button text="left-end" custom-text-style="font-size: 24rpx" />
        </xz-tooltip>
        <xz-tooltip :ref="ref => $refs.xztooltip.push(ref)"
                    :tips="$state.horizontal" direction="right-end">
          <uv-button text="right-end" custom-text-style="font-size: 24rpx" />
        </xz-tooltip>
      </view>

      <view class="tooltip-demo__control">
        <text class="tooltip-demo__control__title">通过组件API控制</text>
        <uv-button type="primary" text="一键全启" @click="startupEvent" />
      </view>
    </demo-item>
    <demo-item title="长按提示">

    </demo-item>
  </view>
</template>

<style lang="scss" scoped>
  .tooltip-demo {
    @include container();

    &__vertical {
      width: 100%;
      display: grid;
      grid-template: repeat(2, max-content) / repeat(3, 30%);
      grid-row-gap: 6px;
      justify-content: space-between;
    }

    &__horizontal {
      width: 100%;
      display: grid;
      grid-template: repeat(3, 100rpx) / repeat(2, 20%);
      grid-gap: 12rpx;
      justify-content: center;
    }

    &__vertical, &__horizontal {
      margin-bottom: 80px;
    }

    &__control {
      display: flex;
      flex-direction: column;

      &__title {
        font-size: .9em;
        margin-bottom: 6px;
        color: #FF9224;
      }
    }
  }

</style>
