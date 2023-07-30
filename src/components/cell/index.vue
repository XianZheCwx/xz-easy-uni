<template>
  <view class="cell" @click="cellEvent">
    <slot name="label">
      <view class="cell_label">{{ $props.lable }}</view>
    </slot>
    <slot name="icon">
      <view class="cell_icon">{{}}</view>
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

  import { Router } from "@/utils/xzHelper";

  const $props = defineProps({
    lable: { type: String, required: true },
    to: { type: String },
    height: { type: String, default: "80rpx" },
    bgc: { type: String, default: "#FFF" },
    activeBgc: { type: String, default: "#F3F3F3" },
    style: { type: Object, default: {} }
  });
  const $state = reactive({});
  const $emits = defineEmits([]);


  function cellEvent() {
    Router.push($props.to);
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
    padding: 10rpx 20rpx;
    background-color: v-bind("$props.bgc");
    border-radius: 16rpx;
    box-shadow: 0 0 5px #8F8F94;
    cursor: pointer;

    &:active {
      background-color: v-bind("$props.activeBgc")
    }
  }

</style>
