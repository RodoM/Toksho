<script setup>
import ContentBlock from "@/components/shared/blocks/ContentBlock.vue";
import HeaderTitle from "@/components/frontend/headers/HeaderTitle.vue";
</script>

<template>
  <div class="container mx-auto my-5">
    <div class="flex flex-col gap-5">
      <content-block>
        <header-title class="">
          <span class="text-2xl font-bold">CONTACTO</span>
        </header-title>
        <div class="flex flex-col gap-2">
          <div>
            <span class="font-bold">Dirección</span>
            <span class="font-medium">
              Entre Ríos 889, San Lorenzo, Santa Fe.
            </span>
          </div>
          <div>
            <span class="font-bold">Teléfono</span>
            <span class="font-medium"> 341-6022682 </span>
          </div>
          <div>
            <span class="font-bold">Instagram</span>
            <span class="font-medium"> Toksho.Comic </span>
          </div>
          <div>
            <span class="font-bold">Horarios</span>
            <span class="font-medium">
              Lunes a viernes de 10 a 12 y 16 a 20, Sábados de 11 a 19.
            </span>
          </div>
        </div>
      </content-block>
      <div class="w-full">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3355.85120910867!2d-60.73914318441111!3d-32.74314138098227!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95b65b5764fd94f3%3A0xf1c310865ef199a8!2sTOKSHO%20COMIC!5e0!3m2!1ses-419!2sar!4v1676674481705!5m2!1ses-419!2sar"
          allowfullscreen="false"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          class="w-full border-2 h-96 border-tertiary-dark drop-shadow-items"
        ></iframe>
      </div>
    </div>
  </div>
</template>
