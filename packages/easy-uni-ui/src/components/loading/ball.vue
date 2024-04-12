<template>
  <view v-if="$props.show" class="loading-ball">
    <view class="loading-mask" @click="maskEvent">
      <view class="loading-ball_inner">
        <view class="container-ball">
          <view v-for="item in Array.from({ length: 8 }, (_, index) => index + 1)" :key="item" class="ball" />
        </view>
      </view>
    </view>
    <view class="loading-hint">
      <slot name="hint">
        <text>{{ $props.hint }}</text>
      </slot>
    </view>
  </view>
</template>

<script lang="ts" setup>
  /*
   * 组件名: ball
   * 组件用途: 小球穿梭放大loading动画
   * 创建日期: 2023/5/23
   * 编写者: XianZhe
   */
  //import {computed, reactive, onMounted} from "vue";

  //const $refs = reactive({});
  const $props = defineProps({
    show: {
      type: Boolean,
      default: false
    },
    maskclose: {
      type: Boolean,
      default: false
    },
    hint: {
      type: String,
      default: "加载中...."
    }
  });
  //const $state = reactive({});
  const $emits = defineEmits(["mask"]);

  function maskEvent() {
    $emits("mask");
  }
</script>

<style lang="scss" scoped>
  .loading-ball {
  }

  .loading-mask {
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    z-index: 99;
    background-color: rgba(0, 0, 0, 0.89);
    filter: contrast(10);

    .loading-ball_inner {
      transform: translateY(-50upx);
      filter: blur(10px);
    }

    .container-ball {
      margin: auto;
      position: relative;
      width: 10vmin;
      height: 10vmin;
    }
  }

  .loading-hint {
    position: fixed;
    left: 45%;
    top: 53vh;
    color: #fff;
    z-index: 100;
  }

  .ball {
    $count: 7;

    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #fff;
    border-radius: 50%;
    transform: translate(-700%, 0);
    opacity: 0;

    @for $i from 0 through $count {
      &:nth-child(#{$i}) {
        animation: move 3.5s infinite #{$i * 0.2 + 0.1}s linear;
      }
    }

    &:first-of-type {
      animation: scaleMove 3.5s infinite linear;
    }
  }

  @keyframes move {
    25% {
      opacity: 1;
      transform: translate(-1vw, 0);
    }
    50% {
      opacity: 1;
      transform: translate(1vw, 0);
    }
    75%,
    100% {
      opacity: 0;
      transform: translate(700%, 0);
    }
  }

  @keyframes scaleMove {
    25% {
      opacity: 1;
      transform: translate(-1vw, 0);
    }
    35% {
      opacity: 1;
      transform: scale(1);
    }
    70% {
      opacity: 1;
      transform: translate(1vw, 0) scale(2);
    }
    90%,
    100% {
      opacity: 0;
      transform: translate(1vw, 0) scale(1);
    }
  }
</style>
