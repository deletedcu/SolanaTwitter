import { TypeOptions, toast, Slide } from "react-toastify";

export const notify = (message: string, type: TypeOptions) => {
  toast(message, {
    position: "bottom-right",
    theme: "light",
    autoClose: 5000,
    transition: Slide,
    hideProgressBar: false,
    pauseOnFocusLoss: false,
    type: type,
    className: "toast-message",
  });
};
