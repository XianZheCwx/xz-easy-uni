<template>
  <view id="signature">
    <demo-item :title="signature_1.title">
      <signature v-model="signature_1.val" tip="签名完毕请点击保存" />
    </demo-item>
    <demo-item :title="signature_2.title">
      <signature v-model="signature_2.val" landscape />
    </demo-item>
    <demo-item :title="signature_3.title">
      <signature v-model="signature_3.val"
                 landscape bgc="#F0F0F0"
                 placeholder="请确保本人签名" placeholder-landscape="签名是代表本人的重要凭证之一"
                 tip="点击保存退出签名" tip-color="#600000" confirm-text="确定" cancel-text="取消" />
    </demo-item>
    <demo-item :title="signature_4.title">
      <signature :ref="el => $ref.signature_4 = el"
                 landscape v-model="signature_4.val" />
    </demo-item>
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

  const $ref = reactive({
    signature_4: null
  });
  const $state = reactive({});

  const signature_1 = reactive({
    title: "基本使用",
    val: ""
  });

  const signature_2 = reactive({
    title: "横屏",
    val: ""
  });

  const signature_3 = reactive({
    title: "自定义颜色与提示",
    val: ""
  });

  const signature_4 = reactive({
    title: "手动保存",
    val: ""
  });

  onMounted(() => {

  });
</script>

<style lang="scss" scoped>
  #signature {
    @include container()
  }

</style>
