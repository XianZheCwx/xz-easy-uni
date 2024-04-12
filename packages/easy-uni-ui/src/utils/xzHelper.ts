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
