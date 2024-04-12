import { markRaw } from "vue";
import type {
  CascaderNode,
  CascaderRawNode,
  CascaderAdvancedProps
} from "../types/index";

export class VirtualNode {
  constructor(readonly props: CascaderAdvancedProps) {
    this.props = props;
  }

  parseRecursion(nodes: CascaderNode[], level = 0): CascaderRawNode[] {
    if (!Array.isArray(nodes) || nodes.length === 0) {
      return [];
    }
    const currnodes: CascaderRawNode[] = [];
    for (const item of nodes) {
      // 字段处理
      const node: CascaderRawNode = { level, ...this.customFields(item) } as CascaderRawNode;
      if (!node.isleaf) {
        node.children = this.parseRecursion(node.children as CascaderNode[], level + 1);
      }
      currnodes.push(node as CascaderRawNode);
    }

    return currnodes;
  }

  hashRecursion(
    nodes: CascaderNode[] | CascaderRawNode[],
    table: { [key: string]: CascaderNode | CascaderRawNode },
    { fields = false } = {}
  ): void {
    for (let item of nodes) {
      fields && (item = this.customFields(item as CascaderNode));

      // 更新操作利用深数据合并
      if (Object.hasOwnProperty.call(table, item.value!)) {
        Object.assign(table[item.value!], item);
      } else {
        table[item.value!] = item;
      }

      if (!item.isleaf && item.children?.length > 0) {
        this.hashRecursion(item.children, table, { fields });
      }
    }
  }

  customFields(node: CascaderNode,
               fieldNames?: CascaderAdvancedProps): CascaderNode {
    !fieldNames && (fieldNames = this.props);

    const {
      [fieldNames?.label]: label = "",
      [fieldNames?.value]: value = "",
      [fieldNames?.children]: children = [],
      ...meta
    } = node;

    // 叶子节点处理
    return {
      label,
      value,
      children,
      checked: false,
      meta: markRaw(meta),
      isleaf: (Array.isArray(children) && children.length <= 0) ?? false
    } as CascaderNode;
  }

  async sleepLazyLoad(
    uid: string | number,
    map: { [key: string]: CascaderRawNode },
    { timeout = 1000, interval = 100 } = {}
  ): Promise<boolean> {
    const startTime = new Date().getTime();
    return await new Promise((resolve) => {
      function rhelp(status: boolean, timer: unknown) {
        clearInterval(timer as number);
        resolve(status);
      }

      const timer = setInterval(() => {
        const node = map?.[uid];
        const endTime = new Date().getTime();
        if (node && !node?.isleaf) {
          rhelp(true, timer);
        }
        // 超时处理
        if (endTime - startTime >= timeout) {
          rhelp(false, timer);
        }
      }, interval);
    });
  }
}
