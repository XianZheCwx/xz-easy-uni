/**
 * 组件属性辅助
 * 🙌 能够使用更少的代码编写，有助于减少包体积
 */
import type { PropType } from 'vue';

export const unknownProp = null as unknown as PropType<unknown>;

export const numericProp = [Number, String];

export const truthProp = {
  type: Boolean,
  default: true as const
};

export const lieProp = {
  type: Boolean,
  default: false as const
};

export function makeRequiredProp<T>(type: T) {
  return { type, required: true as const };
}

export function makeNumericProp<T>(defVal: T) {
  return { type: numericProp, default: defVal };
}

export function markStringProp<T>(defVal: T) {
  return { type: String as unknown as PropType<T>, default: defVal };
}

export function markNumber<T>(defVal: T) {
  return { type: Number as unknown as PropType<T>, default: defVal };
}


export function markArrayProp<T>(defVal: T[]) {
  return { type: Array as PropType<T[]>, default: defVal };
}

export function markObjectProp<T>(defVal: T) {
  return { type: Object as PropType<T>, default: defVal };
}
