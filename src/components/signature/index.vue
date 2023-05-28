<template>
  <view class="signature">
    <!--    <view class="signature-wrap">-->
    <!--      <canvas class="signature-canvas" disable-scroll="true" :style="{'width':width,'height':height}" canvas-id="designature"-->
    <!--              @touchstart="starts"-->
    <!--              @touchmove="moves" @touchend="end"></canvas>-->
    <!--      <view class="signature-operation u-flex">-->
    <!--        <view class="signature-tip">-->
    <!--          <slot name="tip">-->
    <!--            <text>请你在此手动签写自己的签章，签写操作完毕点击保存按钮</text>-->
    <!--          </slot>-->
    <!--        </view>-->
    <!--        <view class="btn" style="margin-top: 18vw;" @click="cancel">取消</view>-->
    <!--        <view class="btn" style="margin-top: 8vw;" @click="clear">清除</view>-->
    <!--        <view class="btn blue" @click="save">保存</view>-->
    <!--      </view>-->
    <!--    </view>-->
  </view>
</template>

<script lang="ts" setup>
  /*
   * 组件名: signature
   * 组件用途: 签名组件（只用于签名）
   * 创建日期: 2023/5/26
   * 编写者: XianZhe
   */
  //  import {computed, reactive, onMounted} from "vue";
  //
  //  const $refs = reactive({});
  //  const $props = defineProps({});
  //  const $state = reactive({});
  //  const $emits = defineEmits([]);
  //
  //
  //  function execute() {
  //  }
  //
  //  onMounted(() => {
  //    execute();
  //  });
</script>

<style lang="scss" scoped>
  .signature {
    position: relative;
    overflow: hidden;
    background-color: #fff;
    height: 100vh;
    width: 100vw;
    padding: 40upx 32upx 60upx;

    &-wrap {
      background-color: #fff;
      border-radius: 20rpx;
      padding: 12px 12px 100px;
      box-shadow: 0 6rpx 42rpx rgba(0, 0, 0, 0.05);
    }

    &-canvas {
      background-color: #e6e6e6;
      position: relative;
      z-index: 9999;
    }

    &-operation {
      flex-direction: column;
      justify-content: center;
      width: 100px;
      height: 80vw;
      padding: 10px;
      // background-color: #007AFF;
      position: fixed;
      left: 50%;
      bottom: -40vw;
      transform: rotate(90deg);
      margin-left: -50px;
      margin-bottom: 72px;
    }
  }

  .signa {
    .bottomBox {
      .tip {
        font-size: 11px;
        color: #ff6f77;
      }

      .btn {
        width: 100%;
        height: 37px;
        background: #f5f5f5;
        border-radius: 19px;
        margin-top: 7px;
        text-align: center;
        line-height: 37px;
        color: #333;
        font-size: 13px;

        &.blue {
          background: #284cf4;
          color: #fff;
        }
      }
    }
  }
</style>
