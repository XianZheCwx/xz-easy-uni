// 类型
export type CascaderType = "top" | "bottom";

// 节点类型
export interface CascaderRawNode {
  label: string;
  value: string | number;
  level: number;
  isleaf: boolean;
  checked: boolean;
  children: CascaderRawNode[];
}

export interface CascaderNode extends Partial<Omit<CascaderRawNode, "children">> {
  value: string | number;
  children: Node[];
}

export interface CascaderAdvancedProps extends Partial<Record<keyof Omit<CascaderRawNode, "isleaf" | "level">, string>> {
  lazy?: boolean;
  multiple?: boolean;
  checkStrictly?: boolean;
}

export interface CascaderOpts {
  [opt: string]: unknown;

  uid: string | number;
  source: CascaderRawNode[];
  checked: string | number;
  hash: { [key: string]: CascaderRawNode };
  originalHash: { [key: string]: Node };
}
