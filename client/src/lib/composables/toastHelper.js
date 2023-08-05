import { useToast } from "vue-toast-notification";

const $toast = useToast();

export const showToast = (message, type) => {
  $toast.open({
    position: "top-right",
    message,
    type,
    duration: 5000,
    dismissible: true,
    pauseOnHover: true,
  });
};
