<template>
  <view class="cell" @click="cellEvent">
    <slot name="label">
      <view class="cell_label">{{ $props.lable }}</view>
    </slot>
    <slot name="icon">
      <view class="cell__icon">
        <uni-icons :type="$props.icon" color="inherit" size="1.5em" />
      </view>
    </slot>
  </view>
</template>

<script lang="ts" setup>
  /*
   * 组件名: index
   * 组件用途: XXX
   * 创建日期: 2023/7/23
   * 编写者: XianZhe
   */
  import { computed, reactive, onMounted } from "vue";

  import { cellProps } from "./helper/props";
  import { Router } from "@/utils";

  const $props = defineProps(cellProps);
  const $state = reactive({});
  const $emits = defineEmits([]);

  function cellEvent() {
    if ($props.to) {
      Router.push($props.to);
    }
  }

  onMounted(() => {

  });
</script>

<style lang="scss" scoped>
  .cell {
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: v-bind("$props.height");
    padding: 10rpx 30rpx;
    background-color: v-bind("$props.bgc");
    border-radius: 16rpx;
    box-shadow: 0 0 5px v-bind("$props.shadow");
    cursor: pointer;

    &:active {
      background-color: v-bind("$props.activeBgc");
    }

    &__icon {
      width: 10%;
      font-size: 28rpx;
      color: $uni-text-color;
    }
  }

</style>
