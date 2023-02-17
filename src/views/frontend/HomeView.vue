<script setup>
import HeaderTitle from "@/components/frontend/headers/HeaderTitle.vue";
import ProductCard from "@/components/shared/products/ProductCard.vue";
</script>

<template>
  <div>
    <div class="w-full bg-slate-400 h-96">slider</div>
    <div
      class="flex justify-center p-5 bg-secondary-light border-y-2 border-tertiary-dark"
    >
      <div
        class="flex items-center border-2 border-tertiary-dark drop-shadow-items"
      >
        <input type="text" placeholder="Busqueda..." class="p-2" />
        <button
          class="p-2 border-l-2 material-icons-outlined border-tertiary-dark bg-primary-light"
        >
          search
        </button>
      </div>
    </div>
    <div class="flex flex-col items-center my-5 gap-y-5">
      <header-title>
        <span class="text-2xl font-bold">NOVEDADES</span>
      </header-title>
      <div class="grid w-full grid-cols-2 px-5 gap-y-5">
        <ProductCard
          v-for="i in 3"
          :key="i"
          :title="'SECRET WARS'"
          :price="1200"
          :stock="10"
        />
        <ProductCard
          v-for="i in 2"
          :key="i"
          :title="'SECRET WARS'"
          :price="1200"
          :discount="10"
          :stock="10"
        />
        <ProductCard
          v-for="i in 1"
          :key="i"
          :title="'SECRET WARS'"
          :price="1200"
          :stock="0"
        />
      </div>
      <div
        class="flex flex-col items-center w-full py-5 bg-secondary-light border-y-2 border-tertiary-dark"
      >
        <header-title>
          <span class="text-2xl font-bold">PREVENTA</span>
        </header-title>
        <!-- TODO: Aislar en un componente que se llame productsList -->
        <div class="grid w-full grid-cols-2 px-5 mt-5">
          <ProductCard
            v-for="i in 2"
            :key="i"
            :title="'SECRET WARS'"
            :price="1200"
            :stock="10"
          />
        </div>
      </div>
      <header-title>
        <span class="text-2xl font-bold">NUESTRO LOCAL</span>
      </header-title>
      <div class="w-full px-5">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3355.85120910867!2d-60.73914318441111!3d-32.74314138098227!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95b65b5764fd94f3%3A0xf1c310865ef199a8!2sTOKSHO%20COMIC!5e0!3m2!1ses-419!2sar!4v1676674481705!5m2!1ses-419!2sar"
          allowfullscreen=""
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          class="w-full border-2 h-96 border-tertiary-dark drop-shadow-items"
        ></iframe>
      </div>
    </div>
  </div>
</template>
