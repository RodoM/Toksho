import { defineStore } from "pinia";
import { ref } from "vue";

export const userStore = defineStore("user", () => {
  const user = ref(null);

  const setUser = (payload) => {
    user.value = payload ? payload.user : null;
  };

  return {
    user,
    setUser,
  };
});
