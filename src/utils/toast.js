import { toast } from "react-toastify";

export const showSuccess = (msg) =>
  toast.success(msg, {
    position: "top-center",
    autoClose: 2000,
  });

export const showError = (msg) =>
  toast.error(msg, {
    position: "top-center",
    autoClose: 2500,
  });
