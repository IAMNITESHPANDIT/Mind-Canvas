import { toast } from "react-toastify";

export const ToastOnSuccessResponse = (str) => {
  toast.success(str);
};

export const ToastOnFailureResponse = (str) => {
  toast.error(str);
};
