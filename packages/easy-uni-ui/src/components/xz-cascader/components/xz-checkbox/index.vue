<template>
  <radio v-if="$props.type === 'radio'" :checked="$props.modelValue" :color="$props.color" class="xz-checkbox" @click.prevent.stop="checkboxEvent" />
  <checkbox v-else :checked="$props.modelValue" :color="$props.color" class="xz-checkbox" @click.prevent.stop="checkboxEvent" />
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

  const $props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: "var(--primary-color)"
    },
    type: {
      type: String as PropType<"checkbox" | "radio">,
      default: "checkbox"
    },
    // 大小
    size: {
      type: String as PropType<"large" | "small" | "mini">,
      default: "small"
    }
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
    transform: v-bind(nuSizeStyle);
  }
</style>
