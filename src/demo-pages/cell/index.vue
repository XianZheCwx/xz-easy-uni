<template>
  <view id="cell">

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

  const $props = defineProps({
    height: { type: String, default: "20px" },
    bgc:  { type: String, default: "#FFF" },
  });
  const $state = reactive({});
  const $emits = defineEmits([]);


  onMounted(() => {

  });
</script>

<style lang="scss" scoped>
  .cell {
    background-color: v-bind("$props.bgc");
  }

</style>
