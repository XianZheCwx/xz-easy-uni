<template>
  <view class="demo-item">
    <view class="demo-item__hd">
      <slot name="title">
        <text class="demo-item__text">{{ $props.title }}</text>
      </slot>
      <slot name="sub-title">
        <text>{{ $props.subTitle }}</text>
      </slot>
    </view>
    <view class="demo-item__bd">
      <slot name="default" />
      <text ></text>
    </view>
  </view>
</template>

<script lang="ts" setup>
  /*
   * 组件名: demo-item
   * 组件用途: XXX
   * 创建日期: 2023/7/22
   * 编写者: XianZhe
   */
  import { computed, reactive, onMounted } from "vue";

  const $props = defineProps({
    title: {
      type: String
    },
    subTitle: {
      type: String
    }
  });
  const $state = reactive({});
  const $emits = defineEmits([]);

</script>

<style lang="scss" scoped>
  .demo-item {
    display: flex;
    flex-direction: column;
    margin-bottom: 80upx;

    &__hd {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20upx;
    }

    &__text {
      color: $uni-text-color;
      font-size: 34upx;
    }
  }

</style>
