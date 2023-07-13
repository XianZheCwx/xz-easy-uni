import { getCurrentInstance, markRaw, onBeforeMount, onUnmounted, reactive } from "vue";
import type { ComponentInternalInstance } from "vue";
import { DrawSignature, DrawSignature2D } from "@/components/signature/helper/signature";

interface State {
  [state: string]: unknown;

  uidCanvas?: string;
  emptyCanvas?: boolean;
}

export function useSignature({
  __init__,
  signature
}: {
  __init__?: () => void;
  signature?: () => DrawSignature2D | DrawSignature;
} = {}) {
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
  });

  onUnmounted(() => {
    signature?.().killTemp();
    console.groupEnd();
  });

  return { $refs, $state, landscapeOpts };
}
