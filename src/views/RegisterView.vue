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
          type="text"
          placeholder="Usuario"
          class="w-full p-3 border-2 border-tertiary-dark drop-shadow-items focus:outline-none"
        />
        <input
          type="password"
          placeholder="Contraseña"
          class="w-full p-3 border-2 border-tertiary-dark drop-shadow-items focus:outline-none"
        />
        <button class="p-3 text-sm font-bold border-2 bg-secondary-light border-tertiary-dark drop-shadow-items">
          REGISTRARSE
        </button>
      </form>
      <span class="text-sm font-bold text-center">O</span>
      <div class="flex flex-col gap-6 px-5 lg:flex-row">
        <button class="p-3 border-2 bg-[#1877F2] border-tertiary-dark drop-shadow-items flex items-center gap-4 w-full justify-center">
          <img src="@/assets/svgs/facebook-icon.svg" alt="">
          <span class="text-sm font-bold text-white">REGISTRARSE CON FACEBOOK</span>
        </button>
        <button class="flex items-center justify-center w-full gap-4 p-3 border-2 bg-background border-tertiary-dark drop-shadow-items">
          <img src="@/assets/svgs/google-icon.svg" alt="">
          <span class="text-sm font-bold text-slate-500">REGISTRARSE CON GOOGLE</span>
        </button>
      </div>
      <span class="font-medium text-center">
        ¿Ya sos usuario?
        <router-link :to="'/ingresar'" class="font-bold">
          Iniciar sesión
        </router-link>
      </span>
    </div>
  </div>
</template>
