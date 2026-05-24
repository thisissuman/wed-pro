import { toast as sonnerToast } from "sonner";

export const TOAST_DURATION_MS = 1000;

const defaultOptions = { duration: TOAST_DURATION_MS };

export const toast = {
  success: (message: string, description?: string, id?: string | number) =>
    sonnerToast.success(message, { description, id, ...defaultOptions }),
  error: (message: string, description?: string, id?: string | number) =>
    sonnerToast.error(message, { description, id, ...defaultOptions }),
  info: (message: string, description?: string, id?: string | number) =>
    sonnerToast.info(message, { description, id, ...defaultOptions }),
  loading: (message: string, id?: string | number) =>
    sonnerToast.loading(message, { id, ...defaultOptions }),
  dismiss: (id?: string | number) => sonnerToast.dismiss(id),
};
