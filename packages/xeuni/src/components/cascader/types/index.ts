// 类型
export type Type = "top" | "bottom";

// 节点类型
export interface RawNode {
  label: string;
  value: string | number;
  level: number;
  isleaf: boolean;
  checked: boolean;
  children: RawNode[];
}

export interface Node extends Partial<Omit<RawNode, "children">> {
  value: string | number;
  children: Node[];
}

export interface Props extends Omit<Node, "isleaf" | "children"> {
  value: string;
  isleaf: string;
  children: string;
  lazy?: boolean;
  multiple?: boolean;
  checkStrictly?: boolean;
}

export interface CascaderOpts {
  [opt: string]: unknown;

  uid: string | number;
  source: RawNode[];
  checked: string | number;
  hash: { [key: string]: RawNode };
  originalHash: { [key: string]: Node };
}
