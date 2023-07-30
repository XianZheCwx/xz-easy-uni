<template>
  <view id="demo-home" class="demo-home">
    <view class="demo-home__hd">
      <view class="demo-home__logo"></view>
      <view class="demo-home__title"></view>
    </view>
    <view class="demo-home__bd">
      <demo-item :title="formOpts.title">
        <cell v-for="item in formOpts.list" :id="item.to"
              :lable="item.label" :to="item.to"/>
      </demo-item>
    </view>
  </view>
</template>

<script lang="ts" setup>
  /*
 * 组件名: index
 * 组件用途: xzEasyUni组件目录
 * 创建日期: 2023/7/23
 * 编写者: XianZhe
 */
  import { computed, reactive, onMounted } from "vue";

  import Cell from "@/components/cell/index.vue";
  import { formOpts } from "../config";

  const $props = defineProps({});
  const $state = reactive({});
  const $emits = defineEmits([]);


  onMounted(() => {

  });
</script>

<style lang="scss" scoped>
  #demo-home {}

  .demo-home {
    @include container();

    &__hd {
      display: flex;
      justify-content: space-between;
      height: 100px;
      margin-bottom: 10px;
    }

    &__bd {
      display: flex;
      flex-direction: column;
      //grid-template: ;
    }
  }
</style>
