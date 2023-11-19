<template>
  <div class="slider-range">
    <demo-item :title="sliderRange_1.title">
      <xz-slider-range v-model="sliderRange_1.val" @change="f('111', $event)"/>
    </demo-item>
    <demo-item :title="sliderRange_2.title">
      <xz-slider-range v-model="sliderRange_2.val" solo :decoration="false" @change="f('222', $event)" />
    </demo-item>
    <demo-item :title="sliderRange_3.title">
      <xz-slider-range v-model="sliderRange_3.val" :min="100" :max="1000000" @change="f('222', $event)" />
    </demo-item>
    <demo-item :title="sliderRange_4.title">
      <xz-slider-range v-model="sliderRange_4.val" :format="(val) => `￥${val}万`"
                    hint-color="#007979" hint-size="14px" @change="f('333', $event)"/>
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

  const sliderRange_1 = reactive({
    title: "基本使用",
    val: [0, 100]
  });
  const sliderRange_2 = reactive({
    title: "传统单区间滑块",
    val: []
  });
  const sliderRange_3 = reactive({
    title: "自定义区间",
    val: []
  });
  const sliderRange_4 = reactive({
    title: "自定义区间提示",
    val: []
  });

  function f(name, val) {
    console.log(name, val)
  }

  onMounted(() => {

  });
</script>

<style lang="scss" scoped>
  .slider-range {
    @include container();

  }

</style>
