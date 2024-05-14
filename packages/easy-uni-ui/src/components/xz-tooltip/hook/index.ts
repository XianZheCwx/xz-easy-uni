import {
  computed,
  getCurrentInstance,
  onMounted,
  reactive,
  type ComponentInternalInstance
} from "vue";
import type { XzTooltipProps } from "../props";
import { getRect } from "@/utils/xzUniHelper";
import type { XzTooltipDirection } from "@/components/xz-tooltip/type";

// 水平方向气泡默认宽度
const HORIZONTAL_WIDTH = "40vw";
// 垂直方向气泡默认宽度
const VERTICAL_WIDTH = "60vw";

export const useXzTooltip = (
  $props: XzTooltipProps,
  $emits: (event: string, ...args: unknown[]) => void
) => {
  const $refs: { self: ComponentInternalInstance } = {
    self: getCurrentInstance()!
  };
  // 计时器存储地址
  let _timer: number | null = null,
    _longPressTimer: number | null = null;
  const $state = reactive({
    show: false,
    // 元素
    rect: {} as UniNamespace.NodeInfo,
    // 屏幕
    screen: {} as { width: number, height: number }
  });

  onMounted(exec);

  const nuShow = computed(() => {
    return $props.show && $state.show;
  });

  const xzTooltipStyle = computed(() => {
    const { screen, rect } = $state;
    // 三角箭头定位数值
    let trianglePos = "50%";
    let { width, direction } = $props;

    // 水平、垂直方位计算
    // 若宽度未指定，则尝试自动计算宽度
    switch (true) {
      case /top|bottom/i.test(direction):
        width ??= VERTICAL_WIDTH;
        break;
      case /left/i.test(direction):
        width ??= rect.left ? rect.left + 60 + "rpx" : HORIZONTAL_WIDTH;
        break;
      case /right/i.test(direction):
        width ??= rect.right ? screen.width - rect.right + 60 + "rpx" : HORIZONTAL_WIDTH;
        break;
      default:
        width ??= HORIZONTAL_WIDTH;
    }

    // 起始、结束方位计算
    switch (true) {
      case /start/i.test(direction):
        trianglePos = "25%";
        break;
      case /end/i.test(direction):
        trianglePos = "75%";
        break;
    }
    return { width, trianglePos };
  });

  function tipsEvent(show?: boolean, ignore = false) {
    if (!ignore && $props.longpress) {
      return;
    }

    $state.show = show ?? !$state.show;
    _timer && clearTimeout(_timer);
    if ($state.show) {
      _timer = setTimeout(() => {
        $state.show = false;
        $emits("close");
      }, Number($props.duration)) as unknown as number;
      return $emits("open");
    }
    $emits("close");
  }

  function tipsStartEvent() {
    _longPressTimer = setTimeout(() => {
      tipsEvent(true, true);
    }, 500) as unknown as number;
  }

  function tipsEndEvent() {
    _longPressTimer && clearTimeout(_longPressTimer);
  }

  async function exec() {
    if ($props.width) {
      return;
    }
    const { screenWidth, screenHeight } = uni.getSystemInfoSync();
    Object.assign($state, {
      rect: await getRect(".xz-tooltip", $refs.self),
      screen: { width: screenWidth, height: screenHeight }
    });
  }

  return {
    $refs, $state,
    nuShow, xzTooltipStyle,
    tipsEvent, tipsStartEvent, tipsEndEvent
  };
};
