<template>
  <view class="cascader-breadcrumb">
    <view v-for="(item, index) in nuOptions" :key="item + index" :class="{ active: nuLevel === index, hint: item.hint }" class="breadcrumb" @click="breadcrumbEvent(index)">
      {{ item.label }}
    </view>
  </view>
</template>

<script lang="ts" setup>
  /*
   * 组件名: breadcrumb
   * 组件用途: 级联选择器面包屑
   * 创建日期: 2023/5/22
   * 编写者: XianZhe
   */
  import { computed, PropType, reactive } from "vue";
  import { RawNode } from "../../types/index";

  interface State {
    [state: string]: unknown;

    manualLevel: number | null;
  }

  // const $refs = reactive({});
  const $props = defineProps({
    options: {
      type: Array as PropType<RawNode[]>,
      required: true
    },
    color: {
      type: String,
      default: "#2894FF"
    }
  });
  const $state: State = reactive({
    manualLevel: null
  });
  const $emits = defineEmits(["change"]);

  const nuOptions = computed(() => {
    const last = { label: "请选择", hint: true };
    switch (true) {
      case $props.options?.length <= 0:
        return [last];
      case $props.options?.at(-1)?.isleaf:
        return $props.options;
      default:
        return [...$props.options, last];
    }
  });

  const nuLevel = computed(() => {
    const length = $props.options?.length;
    // 手动等级
    if ($state.manualLevel !== null && $state.manualLevel <= length) {
      return $state.manualLevel;
    }
    // 自动等级
    return $props.options?.length;
  });

  function breadcrumbEvent(index: number) {
    // 活跃等级处理
    if (index === nuOptions.value.length) {
      resetManualLevel();
    } else {
      resetManualLevel(index);
    }
    $emits("change", $props.options?.[index - 1], index);
  }

  // 重置手动等级
  function resetManualLevel(level: number | null = null) {
    $state.manualLevel = level;
  }

  defineExpose({
    resetManualLevel
  });
</script>

<style lang="scss" scoped>
  .cascader-breadcrumb {
    display: flex;
    margin-bottom: 20upx;
    cursor: pointer;

    .breadcrumb {
      padding-bottom: 6upx;
      cursor: pointer;

      & + .breadcrumb {
        margin-left: 20upx;
      }

      &.active {
        border-bottom: 6upx solid v-bind("$props.color");
      }

      &.hint {
        font-size: 0.95em;
        color: #4f4f4f;
      }
    }
  }
</style>
