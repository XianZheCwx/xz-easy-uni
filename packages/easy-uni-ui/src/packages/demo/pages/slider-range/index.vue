<template>
  <view class="slider-range">
    <demo-item :title="sliderRange_1.title">
      <xz-slider-range v-model="sliderRange_1.val" />
    </demo-item>
    <demo-item :title="sliderRange_2.title">
      <xz-slider-range v-model="sliderRange_2.val" solo :decoration="false"
                       color="#FF359A" />
    </demo-item>
    <demo-item :title="sliderRange_3.title">
      <xz-slider-range v-model="sliderRange_3.val" :min="100" :max="1000000"
                       active-bgc="#2894FF" bgc="#A6FFFF" />
    </demo-item>
    <demo-item :title="sliderRange_4.title">
      <xz-slider-range v-model="sliderRange_4.val[0]"
                       :format="(val) => `￥${val}万`"
                       hint-color="#007979" hint-size="14px" />
      <xz-slider-range v-model="sliderRange_4.val[1]"
                       hint-mode="toast" active-bgc="#2894FF"
                       hint-color="#007979" hint-size="14px" />
      <xz-slider-range v-model="sliderRange_4.val[2]"
                       hint-mode="top" active-bgc="#2894FF"
                       hint-color="#007979" hint-size="14px" />
      <xz-slider-range v-model="sliderRange_4.val[3]"
                       hint-mode="insert" active-bgc="#2894FF"
                       hint-color="#000" hint-size="14px" />
    </demo-item>
  </view>
</template>

<script lang="ts" setup>
  /*
   * 组件名: slider-range
   * 组件用途: 范围滑块demo页
   * 创建日期: 2023/7/22
   * 编写者: XianZhe
   */
  import { computed, reactive, onMounted } from "vue";

  const sliderRange_1 = reactive({
    title: "基本使用",
    val: [0, 100]
  });
  const sliderRange_2 = reactive({
    title: "传统单区间滑块",
    val: [22]
  });
  const sliderRange_3 = reactive({
    title: "自定义区间",
    val: [100, 600000]
  });
  const sliderRange_4 = reactive({
    title: "自定义区间提示",
    val: [[], [], [], [], []]
  });

  onMounted(() => {

  });
</script>

<style lang="scss" scoped>
  .slider-range {
    @include container();
  }

</style>
