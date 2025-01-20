import { RefObject } from "react";
import { create } from "zustand";
import { Toast } from "primereact/toast";
import type { ToastMessage } from "primereact/toast";

type methodFn = (message: string, summary?: string) => void;

type ToastType =
  | "success"
  | "info"
  | "warn"
  | "error"
  | "secondary"
  | "contrast";

function showToast(
  toast: RefObject<Toast> | null,
  severity: ToastType,
  message: string,
  summary?: string
) {
  toast?.current?.show({
    severity,
    summary: summary || "提示",
    detail: message,
    life: 3000,
  });
}

interface ToastStore {
  toast: RefObject<Toast> | null;
  setToast: (toast: RefObject<Toast>) => void;
  show: (message: ToastMessage) => void;
  showInfo: methodFn;
  showError: methodFn;
  showSuccess: methodFn;
  showWarning: methodFn;
  showSecondary: methodFn;
  showContrast: methodFn;
}

const useMessage = create<ToastStore>((set, get) => ({
  toast: null,
  setToast: (toast: RefObject<Toast>) => set({ toast }),
  show: (message: ToastMessage) => {
    get().toast?.current?.show(message);
  },

  showError: (message: string, summary = "错误提示") => {
    showToast(get().toast, "error", message, summary);
  },
  showInfo: (message: string, summary = "信息提示") => {
    showToast(get().toast, "info", message, summary);
  },
  showSuccess: (message: string, summary = "成功提示") => {
    showToast(get().toast, "success", message, summary);
  },
  showWarning: (message: string, summary = "警告提示") => {
    showToast(get().toast, "warn", message, summary);
  },
  showSecondary: (message: string, summary = "提示") => {
    showToast(get().toast, "secondary", message, summary);
  },
  showContrast: (message: string, summary = "提示") => {
    showToast(get().toast, "contrast", message, summary);
  },
}));

export default useMessage;
