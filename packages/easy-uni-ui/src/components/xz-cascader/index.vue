<template>
  <uni-popup
    :ref="(el) => ($refs.popup = el)"
    :type="$props.type"
    background-color="#FFF"
    @mask-click="closeEvent">
    <view class="cascader">
      <view class="cascader-hd">
        <slot name="header">
          <view v-if="$props.type === 'bottom'"
                class="cascader-hd_inner">
            <text class="cascader__title">{{ $props.title }}</text>
            <uni-icons
              v-if="$props.close"
              :type="$props.closeIcon"
              size="1.35em"
              @click.stop="closeEvent"/>
          </view>
        </slot>
      </view>
      <view class="cascader__bd">
        <!-- 选项面包屑 -->
        <cascader-breadcrumb
          :ref="(el) => ($refs.breadcrumb = el)"
          :options="nuBreadcrumb"
          :color="$props.color"
          @change="breadcrumbEvent"/>
        <!-- 选项列 -->
        <cascader-list v-model="cascaderOpts.checked"
                       :check-strictly="nuProps.checkStrictly"
                       :options="currCatalog"
                       @checked="listCheckEvent"
                       @change="listChangeEvent"/>
      </view>
      <view class="cascader__ft">
        <slot name="footer"/>
      </view>
    </view>
  </uni-popup>
  <!-- 加载动画 -->
  <loading-circle :show="$state.loading"
                  :color="$props.color"
                  :z-index="$props.zindex + 1"/>
</template>

<script lang="ts">
export default {
  options: {
    styleIsolation: "shared"
  }
};
</script>

<script lang="ts" setup>
/*
 * 组件名: cascader
 * 组件用途: 级联组件
 * 创建日期: 2023/5/19
 * 编写者: XianZhe
 */
import {
  computed, reactive, watch,
  watchEffect, provide, toRaw,
  type PropType,
  type ComponentInternalInstance
} from "vue";

import type {CascaderOpts, CascaderNode, CascaderAdvancedProps, CascaderRawNode, Type} from "./types/index";
import {cascaderProps, cascaderEmits} from "./helper/props"
import {VirtualNode} from "./helper/cascader";
import LoadingCircle from "@/components/loading/circle";
import CascaderList from "./components/list";
import CascaderBreadcrumb from "./components/breadcrumb";

interface State {
  [state: string]: unknown;

  loading: boolean;
  virtualCascader: VirtualNode;
}

const $refs: {
  [instance: string]:
    | (ComponentInternalInstance & { [func: string]: (...args: unknown[]) => unknown })
    | null;
} = reactive({
  popup: null,
  breadcrumb: null
});
const $props = defineProps(cascaderProps);
const $emits = defineEmits(cascaderEmits);
const $state: State = reactive({
  loading: false,
  virtualCascader: new VirtualNode($props.props)
});

const cascaderOpts: CascaderOpts = reactive({
  // 唯一列加载索引id
  uid: "",
  source: [],
  // 选中项
  // ❗ 异步加载情况下只能选择根节点数据
  checked: "",
  hash: {},
  originalHash: {},
  breadcrumb: []
});

const nuProps = computed<CascaderAdvancedProps>(() => {
  const p = {
    multiple: false,
    checkStrictly: false,
    lazy: false,
    label: "label",
    value: "value",
    children: "children",
    isleaf: "isleaf"
  };
  return Object.assign(p, $props.props);
});

const nuBreadcrumb = computed<CascaderRawNode[]>(() => {
  return cascaderOpts.breadcrumb.map((item) => {
    return cascaderOpts.hash?.[item];
  });
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
function nodeparse(source: CascaderNode[]): CascaderRawNode[] {
  // 哨兵节点
  const virtualNode = $state.virtualCascader.parseRecursion(source);
  const sentinel: CascaderRawNode[] = [{value: "__root__", children: virtualNode} as CascaderRawNode];

  // 原始数据存储
  cascaderOpts.source = virtualNode;
  $state.virtualCascader.hashRecursion(sentinel, cascaderOpts.hash);
  // 懒加载状态下创建源数据哈希表
  $state.virtualCascader.hashRecursion(source, cascaderOpts.originalHash, {fields: true});
  return virtualNode;
}

function closeEvent() {
  $refs.popup?.close?.();
  $emits("update:show", false);
  $emits("close");
}

// 列选中事件
function listCheckEvent(item: CascaderRawNode) {
  $emits("checked", cascaderOpts.hash?.[item.value]);
  $emits("update:modelValue", item.value);
}

function setCurrContext(uid: string | number) {
  cascaderOpts.uid = uid;
  $refs.breadcrumb?.resetManualLevel?.();
}

// 列更改事件
async function listChangeEvent(node: CascaderRawNode) {
  const uid = node.value;
  const originaNode = cascaderOpts.originalHash?.[uid];

  // 更改面包屑
  cascaderOpts.breadcrumb.splice(node.level, cascaderOpts.breadcrumb.length - node.level, uid);

  const event = {
    node: originaNode,
    rawNode: toRaw(node),
    path: toRaw(nuBreadcrumb.value) ?? []
  };

  // 子节点下触发完成处理
  if (node?.isleaf) {
    $emits("finish", event);
    // 懒加载模式
    if (nuProps.value.lazy) {
      $state.loading = true;
      // 等待节点异步加载
      const waitRes = await $state.virtualCascader.sleepLazyLoad(uid, cascaderOpts.hash);
      $state.loading = false;
      // 获取到下一节点则直接返回
      if (waitRes) {
        setCurrContext(uid);
        $emits("change", event);
        return;
      }
      // 获取失败回滚面包屑
      cascaderOpts.breadcrumb.splice(node.level, cascaderOpts.breadcrumb.length - node.level);
    }

    // 再无子节点则选中
    // node.checked = !node.checked;
    if (cascaderOpts.checked === node.value) {
      cascaderOpts.checked = "";
    } else {
      cascaderOpts.checked = node.value;
    }

    // 非严格模式
    if (!nuProps.value.checkStrictly) {
      $emits("checked", event);
      $emits("update:show", false);
    }

    return;
  }

  // 变更节点处理
  setCurrContext(node.value);
  $emits("change", event);
}

function breadcrumbEvent(node: CascaderRawNode, index: number) {
  $emits("clickTab");

  // 根节点特殊处理
  if (index === 0 || !node) {
    cascaderOpts.uid = "__root__";
    return;
  }
  cascaderOpts.uid = node.value;
}

function execute() {
  // 数据解析
  nodeparse($props.options);
}

provide(
  "_ricon",
  computed(() => {
    return $props.ricon?.trim();
  })
);

watchEffect(() => {
  execute();
});

watchEffect(() => {
  cascaderOpts.checked = $props.modelValue;
});

watchEffect(() => {
  $state.virtualCascader = new VirtualNode(nuProps.value);
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
  @import "./scss/cascader.scss";

  :deep(.uni-popup) {
    z-index: v-bind("$props.zindex");
  }
</style>
