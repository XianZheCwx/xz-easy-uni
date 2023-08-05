import {
  getCurrentInstance,
  markRaw,
  onBeforeMount,
  onMounted,
  onUnmounted,
  reactive
} from "vue";
import type { ComponentInternalInstance } from "vue";
import type {
  DrawSignature,
  DrawSignature2D
} from "@/components/signature/helper/signature";

interface State {
  [state: string]: unknown;

  uidCanvas?: string;
  emptyCanvas?: boolean;
}

export function useSignature(
  {
    __init__,
    execute,
    signature
  }: {
    __init__: () => void;
    execute: () => void;
    signature: () => DrawSignature2D | DrawSignature;
  }) {
  // @ts-ignore
  const $refs: { self: ComponentInternalInstance } = reactive({
    self: getCurrentInstance()
  });
  const $state: State = reactive({
    uidCanvas: `signature-${Math.trunc(Math.random() * 1000000)}`,
    emptyCanvas: true
  });
  const landscapeOpts: State = reactive({
    show: false
  });

  onBeforeMount(() => {
    __init__ && __init__();
    console.groupCollapsed("xzTip: signature获取实例", (new Date()).toDateString());
    console.log(signature?.constructor);
  });

  onMounted(() => {
    execute();
    console.groupEnd();
  });

  onUnmounted(() => {
    signature?.().killTemp();
  });

  return { $refs, $state, landscapeOpts };
}
