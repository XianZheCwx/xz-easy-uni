<template>
  <view v-if="$props.show" class="loading-circle">
    <view class="loading-circle_inner">
      <view class="circle" />
      <view class="hint">{{ $props.hint }}</view>
    </view>
  </view>
</template>

<script lang="ts" setup>
  /*
   * 组件名: circle
   * 组件用途: XXX
   * 创建日期: 2023/5/23
   * 编写者: XianZhe
   */
  //import {computed, reactive, onMounted} from "vue";

  //const $refs = reactive({});
  const $props = defineProps({
    color: {
      type: String,
      default: "#000"
    },
    hint: {
      type: String,
      default: "加载中..."
    }
  });
  //const $state = reactive({});
  //const $emits = defineEmits([]);

  //function execute() {
  //}
  //
  //onMounted(() => {
  //  execute();
  //});
</script>

<style lang="scss" scoped>
  .loading-circle {
    position: fixed;
    top: 0;
    left: 0;

    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.75);

    &_inner {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 260upx;
      padding: 50upx 30upx 30upx;
      background-color: #fff;
      border-radius: 3%;
      transform: translateY(-60upx);
    }

    .circle {
      position: relative;
      width: 100upx;
      height: 100upx;
      margin-bottom: 26upx;
      border-radius: 50%;
      transform: rotate(360deg);
      animation: rotate 45s infinite linear;

      &::before,
      &::after {
        position: absolute;
        content: "";
        box-sizing: border-box;
        border-radius: 50%;
        transform: rotate(720deg);
      }

      &::before {
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-top: 3px solid v-bind("$props.color");
        border-left: 3px solid v-bind("$props.color");
        border-bottom: 3px solid transparent;
        border-right: 3px solid transparent;
        animation: rotate 3s infinite ease-out;
      }

      &::after {
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        border-top: 7px solid #fff;
        border-left: 7px solid #fff;
        border-bottom: 7px solid transparent;
        border-right: 7px solid transparent;
        animation: rotate 3s infinite ease-in-out;
      }
    }

    .hint {
    }
  }

  @keyframes rotate {
    100% {
      transform: rotate(0deg);
    }
  }
</style>
