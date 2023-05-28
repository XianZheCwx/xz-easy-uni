<template>
  <uni-popup :ref="(el) => ($refs.popup = el)" :type="$props.type" background-color="#FFF" @mask-click="closeEvent">
    <view class="cascader">
      <view class="cascader-hd">
        <slot name="header">
          <view v-if="$props.type === 'bottom'" class="cascader-hd_inner">
            <text class="cascader-title">{{ $props.title }}</text>
            <uni-icons v-if="$props.close" :type="$props.closeIcon" size="1.35em" @click.stop="closeEvent" />
          </view>
        </slot>
      </view>
      <view class="cascader-bd">
        <!-- 选项面包屑 -->
        <cascader-breadcrumb :ref="(el) => ($refs.breadcrumb = el)" :options="$state.breadcrumb" :color="$props.color" @change="breadcrumbEvent" />
        <!-- 选项列 -->
        <cascader-list v-model="cascaderOpts.checked" :check-strictly="nuProps.checkStrictly" :options="currCatalog" @checked="listCheckEvent" @change="listChangeEvent" />
      </view>
      <view class="cascader-ft">
        <slot name="footer" />
      </view>
      <!-- 加载动画 -->
      <loading-circle :show="$state.loading" :color="$props.color" />
    </view>
  </uni-popup>
</template>

<script lang="ts" setup>
  import type { PropType } from "vue";
  /*
   * 组件名: index
   * 组件用途: XXX
   * 创建日期: 2023/5/19
   * 编写者: XianZhe
   */
  import { computed, reactive, watch, watchEffect } from "vue";
  import type { CascaderOpts, Node, Props, RawNode, Type } from "./types/index";

  import LoadingCircle from "@/components/loading/circle";
  import CascaderList from "./components/list";
  import CascaderBreadcrumb from "./components/breadcrumb";

  interface State {
    [state: string]: unknown;

    breadcrumb: RawNode[];
  }

  const $refs = reactive({
    popup: null,
    breadcrumb: null
  });
  const $props = defineProps({
    modelValue: {
      type: [String, Number],
      default: ""
    },
    show: {
      type: Boolean,
      required: true
    },
    color: {
      type: String,
      default: "#2894FF"
    },
    type: {
      type: String as PropType<Type>,
      default: "bottom"
    },
    props: {
      type: Object as PropType<Props>,
      default: () => ({})
    },
    options: {
      type: Array as PropType<Node[]>,
      default: () => []
    },
    close: {
      type: Boolean,
      default: true
    },
    closeIcon: {
      type: String,
      default: "closeempty"
    },
    title: {
      type: String,
      default: "请选择"
    }
  });
  const $state: State = reactive({
    breadcrumb: [],
    loading: false
  });
  const $emits = defineEmits(["update:show", "update:modelValue", "close", "open", "comfrim", "cancel", "clickTab", "finish", "change", "checked"]);

  const nuProps = computed<Props>(() => {
    return {
      multiple: false,
      checkStrictly: false,
      lazy: false,
      label: "label",
      value: "value",
      children: "children",
      isleaf: "isleaf",
      ...$props.props
    };
  });

  const cascaderOpts: CascaderOpts = reactive({
    // 唯一列加载索引id
    uid: "",
    source: [],
    // 选中项
    // ❗ 异步加载情况下只能选择根节点数据
    checked: "",
    hash: {},
    originalHash: {}
  });

  const currCatalog = computed(() => {
    if (cascaderOpts.uid) {
      return cascaderOpts.hash?.[cascaderOpts.uid]?.children;
    }
    return cascaderOpts.source;
  });

  /**
   * 节点解析
   */
  function _nodeparse(source: Node[]) {
    function parseRecursion(nodes: Node[], level = 0): RawNode[] {
      if (!Array.isArray(nodes) || nodes.length === 0) {
        return [];
      }

      const currnodes: RawNode[] = [];
      for (const item of nodes) {
        // 字段处理
        const node = { level, ...customFieldsHandle(item) };
        if (!node.isleaf) {
          node.children = parseRecursion(node.children, level + 1);
        }
        currnodes.push(node as RawNode);
      }

      return currnodes;
    }

    function hashRecursion(nodes: Node[] | RawNode[], table: { [key: string]: Node }, { fields = false, root = false } = {}): void {
      // 虚拟唯一根节点
      root && (table.__root__ = { value: "__root__", children: nodes });

      for (let item of nodes) {
        fields && (item = customFieldsHandle(item));
        // 更新操作利用深数据合并
        if (Object.hasOwnProperty.call(table, item.value)) {
          Object.assign(table[item.value], item);
        } else {
          table[item.value] = item;
        }

        if (!item.isleaf && item.children?.length > 0) {
          hashRecursion(item.children, table, { fields });
        }
      }
    }

    const res = parseRecursion(source);
    hashRecursion(res, cascaderOpts.hash, { root: true });
    // 懒加载状态下创建源数据哈希表
    hashRecursion(source, cascaderOpts.originalHash, { fields: true, root: true });
    // 原始数据存储
    cascaderOpts.source = res;
    return res;
  }

  function customFieldsHandle(options: any): Node {
    const label = options?.[nuProps.value?.label];
    const value = options?.[nuProps.value?.value];
    const children = options?.[nuProps.value?.children] ?? [];
    // 叶子节点处理
    const isleaf = (Array.isArray(children) && children.length <= 0) ?? false;

    return {
      checked: false,
      label,
      value,
      children,
      isleaf
    };
  }

  function closeEvent() {
    $refs.popup?.close?.();
    $emits("update:show", false);
    $emits("close");
  }

  // 列选中事件
  function listCheckEvent(item: RawNode) {
    console.log("触发选中", item);
    upadateValue(item.value);
  }

  async function lazyloadHelper(uid: string | number, timeout = 1000, interval = 100) {
    const startTime = new Date().getTime();
    $state.loading = true;

    return await new Promise((resolve) => {
      function rhelp(status: boolean, timer: unknown) {
        $state.loading = false;
        clearInterval(timer as number);
        resolve(status);
      }

      const timer = setInterval(() => {
        const node = cascaderOpts.hash?.[uid];
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

  function setCurrContext(uid: string | number, node: RawNode) {
    cascaderOpts.uid = uid;
    $refs.breadcrumb?.resetManualLevel();
    // 更改面包屑
    $state.breadcrumb.splice(node.level, $state.breadcrumb.length - node.level, node);
  }

  function upadateValue(uid: string | number) {
    $emits("checked", cascaderOpts.hash?.[uid]);
    $emits("update:modelValue", uid);
  }

  // 列更改事件
  async function listChangeEvent(node: RawNode) {
    const uid = node.value;
    const originaNode = cascaderOpts.originalHash?.[uid];
    const event = { node: originaNode, rawNode: node, path: [...$state.breadcrumb, node] };
    // 任意节点下不更改值
    !nuProps.value.checkStrictly && upadateValue(uid);

    // 子节点下触发完成处理
    if (node?.isleaf) {
      $emits("finish", event);
      // 懒加载模式
      if (nuProps.value.lazy && (await lazyloadHelper(uid))) {
        return setCurrContext(uid, node);
      }
      // 再无子节点则选中
      node.checked = !node.checked;
      return;
    }
    // 变更节点处理
    setCurrContext(node.value, node);
    $emits("change", event);
  }

  function breadcrumbEvent(node: RawNode, index: number) {
    // 根节点特殊处理
    if (index === 0 || !node) {
      cascaderOpts.uid = "__root__";
    } else {
      cascaderOpts.uid = node.value;
    }
    $emits("clickTab");
  }

  function execute() {
    // 数据解析
    _nodeparse($props.options);
  }

  watchEffect(() => {
    execute();
  });

  watchEffect(() => {
    cascaderOpts.checked = $props.modelValue;
  });

  watch(
    () => $props.show,
    () => {
      if ($props.show) {
        return $refs.popup?.open?.();
      }
      $refs.popup?.close?.();
    }
  );

  //onMounted(() => {
  //  execute();
  //});
</script>

<style lang="scss" scoped>
  .cascader {
    padding: 20upx;

    &-hd {
      margin: 0 10upx 20upx;

      &_inner {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }

    &-bd {
      margin-bottom: 20upx;
    }

    &-title {
      font-size: 1.1em;
      font-weight: bold;
    }
  }
</style>
