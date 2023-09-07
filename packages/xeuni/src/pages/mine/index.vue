<template>
  <view class="mine">

  </view>
</template>

<script lang="ts" setup>
  /*
   * 组件名: index
   * 组件用途: XXX
   * 创建日期: 2023/8/10
   * 编写者: XianZhe
   */
  import { onLoad, onShow } from "@dcloudio/uni-app";
  import { computed, reactive, onMounted } from "vue";
  import type { PropType, ComponentPublicInstance } from "vue";

  const $refs = reactive({});
  const $props = defineProps({});
  const $state = reactive({});
  const $emits = defineEmits([]);


  function execute() {
  }

  onMounted(() => {
    execute();
  });

  onShow(() => {});

  onLoad(() => {});

</script>

<style lang="scss" scoped>
  .mine {}

</style>
