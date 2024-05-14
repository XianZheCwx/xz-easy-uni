<template>
  <view class="demo-item">
    <view class="demo-item__hd">
      <slot name="title">
        <text class="demo-item__text">{{ $props.title }}</text>
      </slot>
      <slot name="sub-title">
        <text v-if="$props.subTitle" class="demo-item__sub-text">{{ $props.subTitle }}</text>
      </slot>
    </view>
    <view class="demo-item__bd">
      <slot name="default"/>
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
  import { makeStringProp } from "@/utils/props"

  const $props = defineProps({
    title: String,
    subTitle: String,
    top: makeStringProp("0px")
  });
  const $state = reactive({});
  const $emits = defineEmits([]);

</script>

<style lang="scss" scoped>
  .demo-item {
    display: flex;
    flex-direction: column;
    margin-bottom: 50rpx;

    &__hd {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 20rpx;
    }

    &__bd {
      padding-top: v-bind("$props.top");
    }

    &__text {
      font-size: 34rpx;
      color: $uni-text-color;
    }

    &__sub-text {
      margin-left: 2px;
      font-size: 24rpx;
      color: $uni-text-color-grey;
    }
  }

</style>
