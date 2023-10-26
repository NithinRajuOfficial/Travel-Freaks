import { toast } from "react-toastify";

export function showSuccess(message) {
  toast.success(message, {
    position: "top-right",
    autoClose: 5000,
  });
}

export function showError(message) {
  toast.error(message, {
    position: "top-right",
    autoClose: 5000,
  });
}
