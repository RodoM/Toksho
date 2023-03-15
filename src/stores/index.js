import { ref } from "vue";
import { defineStore } from "pinia";
import sbHelpers from "@/supabase/helpers.js";

export const userStore = defineStore("user", () => {
  const user = ref(null);

  const setUser = async (payload) => {
    if (payload) {
      user.value = payload.user;
      const id = payload.user.id;
      user.value.isAdmin = await sbHelpers.userIsAdmin(id);
    } else {
      user.value = null;
    }
  };

  return {
    user,
    setUser,
  };
});
