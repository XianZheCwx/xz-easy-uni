export interface SliderBlockCtx {
  blocks: {
    hint: string | number;
    style: Record<string, unknown>;
  }[],
  decoration?: boolean;
}
