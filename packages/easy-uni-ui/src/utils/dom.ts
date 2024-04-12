export interface NodeInfo extends UniNamespace.NodeInfo {
  width: number;
  height: number;
}

// 获取DOM元素矩形宽高
export function getRect(target: string, range?: unknown) {
  return new Promise<NodeInfo>((resolve) => {
    uni
      .createSelectorQuery()
      .in(range)
      .select(target)
      .boundingClientRect((size) => {
        resolve(size as NodeInfo);
      })
      .exec();
  });
}
