<template>
  <div class="slider-range">
    <demo-item :title="sliderRange_1.title">
      <slider-range v-model="sliderRange_1.val" />
    </demo-item>
    <demo-item :title="sliderRange_2.title">
      <slider-range v-model="sliderRange_2.val" solo :decoration="false" />
    </demo-item>
    <demo-item :title="sliderRange_3.title">
      <slider-range v-model="sliderRange_3.val" />
    </demo-item>
  </div>
</template>

<script lang="ts" setup>
  /*
   * 组件名: index
   * 组件用途: XXX
   * 创建日期: 2023/7/22
   * 编写者: XianZhe
   */
  import { computed, reactive, onMounted } from "vue";

  import SliderRange from "@/components/xz-slider-range"

  const sliderRange_1 = reactive({
    title: "基本使用",
    val: [0, 100]
  });
  const sliderRange_2 = reactive({
    title: "传统单区间滑块",
    val: []
  });
  const sliderRange_3 = reactive({
    title: "自定义区间提示",
    val: []
  });

  onMounted(() => {

  });
</script>

<style lang="scss" scoped>
  .slider-range {
    @include container();

  }

</style>
