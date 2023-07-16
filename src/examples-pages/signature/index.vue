<template>
  <view id="signature">
    <signature landscape v-model="signature_1.val" type="2d"/>
  </view>
</template>

<script lang="ts" setup>
  /*
   * 组件名: index
   * 组件用途: 签名组件示例
   * 创建日期: 2023/7/16
   * 编写者: XianZhe
  */
  import { computed, reactive, onMounted } from "vue";
  import Signature from "@/components/signature";

  const $props = defineProps({});
  const $state = reactive({});
  const $emits = defineEmits([]);

  const signature_1 = reactive({
    val: ""
  });


  onMounted(() => {

  });
</script>

<style lang="scss" scoped>
  #signature {}

</style>
