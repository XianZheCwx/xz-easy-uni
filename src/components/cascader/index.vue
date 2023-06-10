<template>
  <view class="signature">
    <!-- 签名主 -->
    <view class="signature__main">
      <canvas
              :id="$state.uidCanvas"
              hidpi
              disable-scroll
              :canvas-id="$state.uidCanvas"
              :class="{ 'signature__canvas--disabled': $props.disabled }"
              class="signature__canvas"
              @touchstart="drawEvent($event, true)"
              @touchmove="drawEvent"
              @touchend="drawEndEvent" />
      <!-- 内容占位 -->
      <view
              v-if="showPlaceholder"
              class="signature__placeholder">
        <text>{{ $props.placeholder }}</text>
      </view>
    </view>
    <view class="signature__operation">
      <view class="signature__tip">
        <slot name="tip">
          <text v-if="$props.tip">{{ $props.tip }}</text>
        </slot>
      </view>
      <view class="signature__btn-container">
        <button
                size="mini"
                class="signature__btn"
                :disabled="$props.disabled"
                @click="cancelEvent">
          {{ $props.cancelText }}
        </button>
        <button
                size="mini"
                type="primary"
                class="signature__btn"
                :disabled="$props.disabled"
                @click="saveEvent">
          {{ $props.confirmText }}
        </button>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
  /*
   * 组件名: signature
   * 组件用途: 签名组件（只用于签名）
   * 创建日期: 2023/5/26
   * 编写者: XianZhe
   */
  import { computed, reactive, onMounted, onUnmounted, watchEffect, getCurrentInstance } from "vue";
  import type { PropType } from "vue";

  type UniTouchEvent = TouchEvent & { touches: (Touch & { x: number; y: number })[] };

  const $refs = reactive({
    self: getCurrentInstance()
  });
  const $props = defineProps({
    // 画布值
    modelValue: {
      type: String,
      default: ""
    },
    // 画布背景颜色
    backgroundColor: {
      type: String,
      default: "#F0F0F0"
    },
    // 取消按钮文案
    cancelText: {
      type: String,
      default: "清空"
    },
    // 确定按钮文案
    confirmText: {
      type: String,
      default: "保存"
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 导出文件类型
    fileType: {
      type: String as PropType<"png" | "jepg">,
      default: "png"
    },
    // 画布宽度
    width: {
      type: String,
      default: "100%"
    },
    // 画布高度
    height: {
      type: String,
      default: "200px"
    },
    // 画笔宽度（大小）
    lineWidth: {
      type: Number,
      default: 5
    },
    // 画笔颜色
    penColor: {
      type: String,
      default: "#000"
    },
    // 签名占位内容
    placeholder: {
      type: String,
      default: "滑动此处签名"
    },
    // 签名提示贴士
    tip: {
      type: String,
      default: ""
    },
    // 画布优先层级
    zIndex: {
      type: Number,
      default: 99
    }
  });
  const $state = reactive({
    uidCanvas: `signature-${Math.trunc(Math.random() * 1000000)}`,
    emptyCanvas: true
  });
  const $emits = defineEmits(["update:modelValue", "save", "cancel", "start", "end", "signing"]);

  // canvas 上下文
  const canvas = computed(() => {
    return uni.createCanvasContext($state.uidCanvas, $refs?.self);
  });

  // 强制标准文件类型
  const nuFileType = computed<"png" | "jepg">(() => {
    if (/^(png|jepg)$/.test($props.fileType)) {
      return $props.fileType;
    }
    console.warn(`不支持${$props.fileType}文件类型`);
    return "png";
  });

  const showPlaceholder = computed<boolean>(() => {
    return $state.emptyCanvas && !$props.disabled;
  });

  const placeholderZindex = computed<number>(() => {
    return $props.zIndex + 1;
  });

  class DrawSignature {
    // 是否为保存输出
    private static _saveOutStatus = false;
    private static _beginTime: null | number = null;
    private static fs: UniNamespace.FileSystemManager = uni.getFileSystemManager();
    static prev: number[] = [];
    static curr: number[] = [];
    // 嵌入图片路径
    static implantImgPath = "";

    static get _draw() {
      return canvas.value;
    }

    static get saveOutStatus() {
      const status = this._saveOutStatus;
      this._saveOutStatus = false;
      return status;
    }

    /**
     * 保存画布
     * @return {Promise<string>} base64字符集
     */
    static async save(): Promise<string> {
      const extractBase64 = new Promise<string>((resolve, reject) => {
        uni.canvasToTempFilePath(
            {
              canvasId: $state.uidCanvas,
              fileType: nuFileType.value,
              // 图片质量
              quality: 1,
              success: ({ tempFilePath }) => {
                this.fs.readFile({
                  filePath: tempFilePath,
                  encoding: "base64",
                  success: ({ data }) => {
                    this._saveOutStatus = true;
                    resolve(base64Handler(data as string));
                  }
                });
              },
              fail(err) {
                reject(err);
              }
            },
            $refs.self
        );
      });
      return await extractBase64;
    }

    /**
     * 设置画笔样式
     * @param {UniNamespace.CanvasContext} draw canvas上下文
     */
    static setPenStyle(draw: UniNamespace.CanvasContext) {
      draw.setLineCap("round");
      draw.setLineWidth($props.lineWidth);
      draw.setFillStyle($props.penColor);
    }

    /**
     * 设置指针
     * @param {number} x x轴坐标
     * @param {number} y y轴坐标
     */
    static setPointer(x: number, y: number) {
      this.prev = this.curr;
      this.curr = [x, y];
      if (this.prev?.length <= 0) {
        this.prev = this.curr;
      }
    }

    /**
     * 绘制画布
     */
    static drawer() {
      const draw = this._draw;
      const [x1, y1, x2, y2] = [].concat(this.prev, this.curr);

      draw.beginPath();
      this.setPenStyle(draw);
      draw.moveTo(x1, y1);
      draw.quadraticCurveTo(x1, y1, x2, y2);

      // 下笔绘图
      draw.stroke();
      draw.draw(true);
    }

    /**
     * 绘制图像到画布
     * @param {string} resource
     * @return {Promise<void>}
     */
    static async drawerImage(resource?: string) {
      // 只允许base64绘制
      if (!resource || !/^data:.+;base64,/.test(resource)) {
        return;
      }
      this.killTemp();

      const draw = this._draw;
      const suffix = /^data:.+\/(?<suffix>\w+);/.exec(resource)?.groups?.suffix;
      this.implantImgPath =
          (uni as Uni & { env: { USER_DATA_PATH: string } })?.env?.USER_DATA_PATH +
          `/${new Date().getTime()}.` +
          suffix ?? "png";
      // 写入本地文件
      this.fs.writeFile({
        filePath: this.implantImgPath,
        data: resource.replace(/^data.+;base64,/, ""),
        encoding: "base64",
        success: () => {
          draw.drawImage(this.implantImgPath, 0, 0);
          draw.draw(true);
        },
        fail: (e) => {
          console.error(e);
        }
      });
    }

    /**
     * 清除缓存
     * ❗ 对于性能来说这很重要
     */
    static killTemp() {
      this.implantImgPath && this.fs.unlinkSync(this.implantImgPath);
    }

    /**
     * 清空画布
     * ❗ 这是一个异步操作，需要获取画布宽高
     * @param {number} tolerance 公差
     */
    static async clear(tolerance = 10) {
      const selector = uni.createSelectorQuery().in($refs.self);
      const { width = 1000, height = 1000 } = await new Promise<UniNamespace.NodeInfo>(
          (resolve) => {
            selector
                .select(`#${$state.uidCanvas}`)
                .boundingClientRect((data) => {
                  resolve(data as UniNamespace.NodeInfo);
                })
                .exec();
          }
      );
      this._draw.clearRect(0, 0, width + tolerance, height + tolerance);
      this._draw.draw();
    }

    /**
     * 完成绘制处理
     */
    static finish() {
      this._beginTime = null;
      this.prev = [];
      this.curr = [];
    }

    static execute(x: number, y: number) {
      const _endTime = new Date().getTime();
      if (this._beginTime && _endTime - this._beginTime < 10) {
        return;
      }
      this._beginTime = _endTime;

      this.setPointer(x, y);
      this.drawer();
    }
  }

  function base64Handler(coding: string) {
    const suffix = nuFileType.value;
    return `data:image/${suffix};base64,` + coding;
  }

  function drawEvent(e: UniTouchEvent, isstart: boolean) {
    // 禁用状态
    if ($props.disabled) {
      return;
    }

    const { x, y } = e?.touches?.[0];
    $state.emptyCanvas = false;
    DrawSignature.execute(x, y);
    if (isstart) {
      return $emits("start", e);
    }
    $emits("signing", e);
  }

  function drawEndEvent(e: UniTouchEvent) {
    DrawSignature.finish();
    $emits("end", e);
  }

  async function saveEvent() {
    const base64 = await DrawSignature.save();
    $emits("save", base64);
    $emits("update:modelValue", base64);
  }

  function cancelEvent() {
    DrawSignature.clear();
    $emits("cancel");
  }

  function execute() {
    watchEffect(() => {
      // 主动抛出不作为画布绘入
      if (!$props.modelValue || DrawSignature.saveOutStatus) {
        return;
      }
      $state.emptyCanvas = false;
      // 画布绘入
      DrawSignature.drawerImage($props.modelValue);
    });
  }

  onMounted(() => {
    execute();
  });

  onUnmounted(() => {
    DrawSignature.killTemp();
  });
</script>

<style lang="scss" scoped>
  @import "./scss/index.scss";

</style>
