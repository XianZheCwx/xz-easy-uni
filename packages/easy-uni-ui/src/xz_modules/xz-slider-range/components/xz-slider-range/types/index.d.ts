
export type HintMode = "top" | "bottom" | "insert" | "toast";

export interface SliderBlockCtx {
  blocks: {
    hint: string | number;
    style: Record<string, unknown>;
    showHint: boolean;
  }[],
  decoration?: boolean;
}
