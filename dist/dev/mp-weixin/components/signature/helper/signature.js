"use strict";
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const common_vendor = require("../../../common/vendor.js");
const fs = common_vendor.index.getFileSystemManager();
class AbstractSignature {
  constructor(props) {
    // 源数据参数获取回调
    __publicField(this, "_rawprops");
    // 画布布局位置单例
    __publicField(this, "_bounding", null);
    // 是否为保存输出
    __publicField(this, "_saveOutStatus", false);
    // 防抖
    __publicField(this, "_beginTime", null);
    // canvas画布元素实例
    __publicField(this, "canvas");
    // 指针存储
    __publicField(this, "prev", []);
    __publicField(this, "curr", []);
    // 嵌入图片路径
    __publicField(this, "implantImgPath", "");
    if (this.constructor === AbstractSignature) {
      throw new TypeError("❗❗不允许实例化AbstractSignature抽象类❗❗");
    }
    this._rawprops = props;
  }
  get props() {
    return this._rawprops();
  }
  get styles() {
    return this.props.style ?? {};
  }
  // 获取画布实例
  get ctx() {
    var _a, _b;
    return common_vendor.index.createCanvasContext((_a = this.props) == null ? void 0 : _a.uidCanvas, (_b = this.props) == null ? void 0 : _b.self);
  }
  get saveOutStatus() {
    const status = this._saveOutStatus;
    this._saveOutStatus = false;
    return status;
  }
  get bounding() {
    if (!this._bounding) {
      return this.getBounding(true);
    }
    return this._bounding;
  }
  async getBounding(inplace = false) {
    const selector = common_vendor.index.createSelectorQuery().in(this.props.self);
    const bounding = await new Promise((resolve) => {
      selector.select(`#${this.props.uidCanvas}`).boundingClientRect((data) => {
        resolve(data);
      }).exec();
    });
    inplace && (this._bounding = bounding);
    return bounding;
  }
  /**
   * 重置内部缓存
   * - 重新获取Canvas宽高
   * - 销毁缓存变量
   * @param {boolean} easy 是否为简单重置
   */
  async reset(easy = false) {
    this._beginTime = null;
    this.prev = [];
    this.curr = [];
    await this.getBounding(true);
  }
  /**
   * 设置指针
   * @param {number} x x轴坐标
   * @param {number} y y轴坐标
   */
  setPointer(x, y) {
    var _a;
    this.prev = this.curr;
    this.curr = [x, y];
    if (((_a = this.prev) == null ? void 0 : _a.length) <= 0) {
      this.prev = this.curr;
    }
  }
  /**
   * 设置画笔样式
   * @param {UniCanvasContext} ctx canvas上下文
   * @param type
   */
  setPenStyle(ctx, type = "native") {
    const { lineWidth, penColor } = this.styles;
    if (/^2d$/i.test(type)) {
      ctx.lineCap = "round";
      Object.assign(ctx, { lineWidth, fillStyle: penColor });
      return;
    }
    ctx.setLineCap("round");
    lineWidth && ctx.setLineWidth(lineWidth);
    penColor && ctx.setFillStyle(penColor);
  }
  /* ---------------------------------------------------------------- */
  draw() {
  }
  drawImage(resource, direction) {
  }
  async rotate(direction, origin = [0, 0]) {
    const ctx = await this.ctx;
    const angle = 90 * Math.PI / 180;
    const [centreX, centreY] = origin;
    ctx.translate(centreX, centreY);
    switch (direction) {
      case "left":
        ctx.rotate(-angle);
        break;
      case "right":
        ctx.rotate(angle);
        break;
      default:
        ctx.rotate(90 * Math.PI / direction);
    }
  }
  /**
   * 保存画布
   * @return {Promise<string>} base64字符集
   */
  save(type = "native", wh) {
    return new Promise((resolve, reject) => {
      const opts = {
        canvasId: this.props.uidCanvas.toString(),
        fileType: this.props.fileType,
        // 图片质量
        quality: this.props.hd ? 0 : 1,
        success: ({ tempFilePath }) => {
          fs.readFile({
            filePath: tempFilePath,
            encoding: "base64",
            success: ({ data }) => {
              this._saveOutStatus = true;
              resolve(base64Handler(data, this.props.fileType));
            }
          });
        },
        fail(err) {
          reject(err);
        }
      };
      if (Array.isArray(wh) && wh.length > 0) {
        const [width, height] = wh;
        Object.assign(opts, { width, height });
      }
      if (/^(2d|webgl)$/i.test(type)) {
        Object.assign(opts, { canvas: this.canvas });
      }
      common_vendor.index.canvasToTempFilePath(opts, this.props.self);
    });
  }
  /**
   * 清空画布
   * ❗ 这是一个异步操作，需要获取画布宽高
   * @param {number} tolerance 公差
   */
  async clear(tolerance = 10) {
    var _a;
    const ctx = await this.ctx;
    const { width = 1e3, height = 1e3 } = await this.bounding;
    ctx.clearRect(0, 0, width + tolerance, height + tolerance);
    "draw" in ctx && ((_a = ctx.draw) == null ? void 0 : _a.call(ctx));
  }
  /* ---------------------------------------------------------------- */
  /**
   * 将base64转存本地文件
   * @param {DrawImage.resource} resource 资源
   * @return {Promise<boolean>} 存储状态
   */
  async base64ToLocal(resource) {
    var _a, _b, _c, _d;
    if (!resource || !/^data:.+;base64,/.test(resource)) {
      console.error("This signature canvas allows base64 drawing only");
      return false;
    }
    const suffix = (_b = (_a = /^data:.+\/(?<suffix>\w+);/.exec(resource)) == null ? void 0 : _a.groups) == null ? void 0 : _b.suffix;
    this.killTemp();
    this.implantImgPath = ((_d = (_c = common_vendor.index) == null ? void 0 : _c.env) == null ? void 0 : _d.USER_DATA_PATH) + `/${new Date().getTime()}.` + suffix;
    await writeFile(resource, this.implantImgPath);
    return true;
  }
  /**
   * 清除缓存
   * ❗ 对于性能来说这很重要
   */
  killTemp() {
    try {
      this.implantImgPath && fs.unlinkSync(this.implantImgPath);
    } catch {
    }
  }
  execute(x, y) {
    const _endTime = new Date().getTime();
    if (this._beginTime && _endTime - this._beginTime < 10) {
      return;
    }
    this._beginTime = _endTime;
    this.setPointer(x, y);
    this.draw();
  }
}
class DrawSignature extends AbstractSignature {
  constructor(props) {
    super(props);
    __publicField(this, "_ctx");
  }
  get ctx() {
    if (!this._ctx) {
      return this.getcanvas(true);
    }
    return this._ctx;
  }
  getcanvas(inplace = false) {
    const ctx = super.ctx;
    inplace && (this._ctx = ctx);
    return ctx;
  }
  /**
   * 绘制画布
   */
  async draw() {
    const ctx = this.ctx;
    let [x1, y1, x2, y2] = [].concat(this.prev, this.curr);
    ctx.beginPath();
    this.setPenStyle(ctx);
    ctx.moveTo(x1, y1);
    ctx.quadraticCurveTo(x1, y1, x2, y2);
    ctx.stroke();
    ctx.draw(true);
  }
  /**
   * 绘制图像到画布
   * @param {string} resource
   * @param direction
   * @return {Promise<void>}
   */
  async drawImage(resource, direction) {
    const ctx = this.ctx;
    const { width, height } = await this.bounding;
    const [centreX, centreY] = [width / 2, height / 2];
    if (!await this.base64ToLocal(resource)) {
      return;
    }
    ctx.save();
    if (direction) {
      await this.rotate(direction, [centreX, centreY]);
      ctx.drawImage(this.implantImgPath, -centreY, -centreX, height, width);
    } else {
      ctx.drawImage(this.implantImgPath, 0, 0, width, height);
    }
    ctx.restore();
    ctx.draw();
  }
}
class DrawSignature2D extends AbstractSignature {
  constructor(props) {
    super(props);
    __publicField(this, "_ctx2d");
    this.get2dcanvas(true);
  }
  get ctx() {
    if (!this._ctx2d) {
      return this.get2dcanvas(true);
    }
    return this._ctx2d;
  }
  async get2dcanvas(inplace = false) {
    const { canvas, ctx } = await new Promise((resolve, reject) => {
      var _a;
      const selector = common_vendor.index.createSelectorQuery().in((_a = this.props) == null ? void 0 : _a.self);
      selector.select(`#${this.props.uidCanvas}`).node(({ node } = {}) => {
        !node && reject(
          "Failed to get the node. Please check whether the canvas element is assigned an id"
        );
        const ctx2 = node.getContext("2d");
        resolve({ canvas: node, ctx: ctx2 });
      }).exec();
    });
    const { width, height } = await this.bounding;
    this.canvas = canvas;
    inplace && (this._ctx2d = ctx);
    this.initCanvas2d(ctx, width, height);
    return ctx;
  }
  /**
   * 初始化处理逻辑宽高
   * @param {UniCanvasContext2D} ctx
   * @param {number} width
   * @param {number} height
   */
  initCanvas2d(ctx, width, height) {
    const dpr = common_vendor.index.getWindowInfo().pixelRatio;
    console.log(`像素比: dpr：${dpr}, width：${width}, height：${height}`);
    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
  }
  async reset(easy = false) {
    await super.reset(easy);
    if (easy) {
      return;
    }
    const { width, height } = await this.bounding;
    this.initCanvas2d(await this.ctx, width, height);
  }
  async draw() {
    const ctx = await this.ctx;
    const [x1, y1, x2, y2] = [].concat(this.prev, this.curr);
    ctx.beginPath();
    this.setPenStyle(ctx, "2d");
    ctx.moveTo(x1, y1);
    ctx.quadraticCurveTo(x1, y1, x2, y2);
    ctx.stroke();
  }
  async drawImage(resource, direction) {
    const ctx = await this.ctx;
    const { width, height } = await this.bounding;
    const [centreX, centreY] = [width / 2, height / 2];
    const image = await this.canvas.createImage();
    if (!await this.base64ToLocal(resource)) {
      return;
    }
    image.src = this.implantImgPath ?? "";
    await new Promise((resolve) => {
      image.onload = () => resolve();
    });
    ctx.save();
    if (direction) {
      await this.rotate(direction, [centreX, centreY]);
      ctx.drawImage(image, -centreY, -centreX, height, width);
    } else {
      ctx.drawImage(image, 0, 0, width, height);
    }
    ctx.restore();
  }
  async save(type = "2d") {
    const { width, height } = await this.bounding;
    return await super.save(type, [width, height]);
  }
}
function base64Handler(coding, suffix) {
  return `data:image/${suffix};base64,` + coding;
}
function writeFile(resource, fpath, encoding = "base64") {
  switch (encoding) {
    case "base64":
      resource = resource.replace(/^data.+;base64,/, "");
      break;
  }
  return new Promise((resolve, reject) => {
    fs.writeFile({
      filePath: fpath,
      data: resource,
      encoding,
      success: () => resolve(),
      fail: reject
    });
  });
}
exports.DrawSignature = DrawSignature;
exports.DrawSignature2D = DrawSignature2D;
