<template>
  <scroll-view scroll-y class="cascader-list">
    <view v-for="(item, index) in nuOptions" :key="item.label + index" class="cascader-item" @click.stop="itemEvent(item)">
      <xz-checkbox v-if="$props.checkStrictly" v-model="item.checked" class="cascader-item_checkbox" type="radio" size="mini" @change="checkedEvent(item)" />
      <view class="cascader-item_value">{{ item.label }}</view>
    </view>
  </scroll-view>
</template>

<script lang="ts" setup>
  /*
   * 组件名: index
   * 组件用途: XXX
   * 创建日期: 2023/5/19
   * 编写者: XianZhe
   */
  import { computed } from "vue";
  import type { PropType } from "vue";

  import XzCheckbox from "@/components/xz-checkbox";
  import type { RawNode } from "../../types/index";

  //const $refs = reactive({});
  const $props = defineProps({
    modelValue: {
      type: [String, Number],
      required: true
    },
    options: {
      type: Array as PropType<RawNode[]>,
      required: true
    },
    checkStrictly: {
      type: Boolean,
      default: false
    }
  });
  //const $state = reactive({});
  const $emits = defineEmits(["update:modelValue", "checked", "change", "item"]);

  const nuOptions = computed(() => {
    return $props.options?.map((item) => {
      // 单选唯一
      item.checked = item.value === $props.modelValue;

      return item;
    });
  });

  function itemEvent(item: RawNode) {
    $emits("change", item);
    $emits("item", item);
  }

  function checkedEvent(item: RawNode) {
    $emits("checked", item);
  }
</script>

<style lang="scss" scoped>
  .cascader-list {
    box-sizing: border-box;
    height: 30vh;
    padding: 0 12upx 0 8upx;
  }

  .cascader-item {
    display: flex;
    align-items: center;
    padding: 16upx 0;
    cursor: pointer;

    &:active {
      background-color: #f0f0f0;
    }

    & + .cascader-item {
      //border-top: 1px solid #E0E0E0;
    }

    &_checkbox {
      margin-right: 6upx;
    }

    &_value {
      font-size: 1.1em;
      color: #272727;
    }
  }
</style>
