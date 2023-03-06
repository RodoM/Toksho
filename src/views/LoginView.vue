<script setup>
import CustomButton from "@/lib/components/CustomButton.vue";
</script>

<template>
  <div class="flex items-center bg-comic">
    <div
      class="container flex flex-col max-w-3xl gap-6 px-5 py-10 mx-auto my-5 bg-white border-2 border-tertiary-dark drop-shadow-items"
    >
      <form action="" class="flex flex-col px-5 gap-9">
        <input
          type="email"
          placeholder="Email"
          class="w-full p-3 border-2 border-tertiary-dark drop-shadow-items focus:outline-none"
        />
        <input
          type="password"
          placeholder="Contraseña"
          class="w-full p-3 border-2 border-tertiary-dark drop-shadow-items focus:outline-none"
        />
        <CustomButton primary>INICIAR SESIÓN</CustomButton>
      </form>
      <span class="text-sm font-bold text-center">O</span>
      <div class="flex flex-col gap-6 px-5 lg:flex-row">
        <CustomButton facebook>
          <img src="@/assets/svgs/facebook-icon.svg" alt="" />
          <span class="text-sm font-bold text-white">
            INGRESAR CON FACEBOOK
          </span>
        </CustomButton>
        <CustomButton google>
          <img src="@/assets/svgs/google-icon.svg" alt="" />
          <span class="text-sm font-bold text-slate-500">
            INGRESAR CON GOOGLE
          </span>
        </CustomButton>
      </div>
      <span class="font-medium text-center">
        ¿Todavía no sos usuario?
        <router-link :to="'/registro'" class="font-bold">
          Registrate
        </router-link>
      </span>
    </div>
  </div>
</template>
