import { create } from "zustand";
import { toast as toastFn, type ToastOptions } from "react-hot-toast";

interface ToastStore {
  toastId: string | null;
  info: (message: string, options?: ToastOptions) => void;
  success: (message: string, options?: ToastOptions) => void;
  error: (message: string, options?: ToastOptions) => void;
}

const useToast = create<ToastStore>((set, get) => ({
  toastId: null,
  info: (message: string, options?: ToastOptions) => {
    const toastId = get().toastId;
    if (toastId) {
      toastFn.dismiss(toastId);
    }
    const newToastId = toastFn(message, options);
    set({ toastId: newToastId });
  },
  success: (message: string, options?: ToastOptions) => {
    const toastId = get().toastId;
    if (toastId) {
      toastFn.dismiss(toastId);
    }
    const newToastId = toastFn.success(message, options);
    set({ toastId: newToastId });
  },
  error: (message: string, options?: ToastOptions) => {
    const toastId = get().toastId;
    if (toastId) {
      toastFn.dismiss(toastId);
    }
    const newToastId = toastFn.error(message, options);
    set({ toastId: newToastId });
  },
}));

export default useToast;
