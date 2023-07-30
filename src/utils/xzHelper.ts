/**
 * 公共辅助性函数
 */
import { format } from "date-fns";

// 格式化日期辅助函数
export function formatDate(date: string, { pattern = "yyyy-MM-dd HH:mm:ss", def = "--" } = {}) {
  try {
    return format(new Date(date), pattern);
  } catch {
    return def;
  }
}

// 路由辅助类
export class Router {
  static push(
    url: string,
    { query, replace = false }: { query?: { [q: string]: unknown }; replace?: boolean } = {}
  ) {
    const fquery = [];
    // query 参数处理
    if (query) {
      if (query.constructor !== Object) {
        return console.error("query must be an object");
      }

      for (let [key, value] of Object.entries(query)) {
        if (value && value.constructor !== String) {
          value = JSON.stringify(value);
        }
        fquery.push(key + "=" + value);
      }
    }

    const joint = /\?/.test(url) ? "&" : "?";
    const func = replace ? uni.redirectTo : uni.navigateTo;
    const furl = url + joint + fquery.join("&");

    func({ url: furl });
  }
}

// 二次确认提示辅助函数
export function confirmHint({
  title,
  message,
  confirmBtnText = "确定",
  cancelBtnText = "取消",
  showCancel = true
}: {
  title: string;
  message: string;
  confirmBtnText?: string;
  cancelBtnText?: string;
  showCancel?: boolean;
}) {
  return new Promise<boolean>((resolve) => {
    uni.showModal({
      title,
      content: message,
      showCancel,
      confirmText: confirmBtnText,
      cancelText: cancelBtnText,
      success: ({ confirm }) => {
        resolve(confirm);
      },
      fail: () => resolve(false)
    });
  });
}
