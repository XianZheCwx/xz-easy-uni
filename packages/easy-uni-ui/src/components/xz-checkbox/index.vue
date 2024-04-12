<template>
  <view class="xz-checkbox">
    <radio
      v-if="$props.type === 'radio'"
      :checked="$props.modelValue"
      :color="$props.color"
      @click.prevent.stop />
    <checkbox
      v-else
      :checked="$props.modelValue"
      :color="$props.color"
      @click.prevent.stop />

    <view class="xz-checkbox__cover" @click.stop="checkboxEvent" />
    <text>
      <slot name="default" />
    </text>
  </view>
</template>

<script lang="ts" setup>
  /*
   * 组件名: index
   * 组件用途: 双向绑定选择框
   * 创建日期: 2023/5/19
   * 编写者: XianZhe
   */
  import { computed } from "vue";

  import { lieProp, makeStringProp } from "@/utils";

  const $props = defineProps({
    modelValue: lieProp,
    color: makeStringProp("var(--primary-color)"),
    type: makeStringProp<"checkbox" | "radio">("checkbox"),
    // 大小
    size: makeStringProp<"large" | "small" | "mini">("small")
  });
  //const $state = reactive({});
  const $emits = defineEmits(["update:modelValue", "change"]);

  const nuSizeStyle = computed(() => {
    switch ($props.size) {
      case "large":
        return "scale(1.1)";
      case "mini":
        return "scale(0.8)";
      default:
        return "scale(0.95)";
    }
  });

  function checkboxEvent() {
    const val = !$props.modelValue;
    $emits("update:modelValue", val);
    $emits("change", val);
  }

</script>

<style lang="scss" scoped>
  .xz-checkbox {
    position: relative;

    &__cover {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 9;
      width: 100%;
      height: 100%;
      transform: v-bind(nuSizeStyle);
    }
  }
</style>
