<script setup>
import ContentBlock from "@/components/shared/blocks/ContentBlock.vue";
import HeaderTitle from "@/components/frontend/headers/HeaderTitle.vue";
</script>

<template>
  <div class="container mx-auto px-5 py-5">
    <div class="flex flex-col gap-5">
      <content-block class="px-5">
        <header-title class="">
          <span class="text-2xl font-bold">¿HACEN ENVIOS?</span>
        </header-title>
        <span class="font-medium">
          Si, al momento de realizar una compra se debe indicar que se solicita envio. Al confirmarse al misma le enviaremos por mail el
          código de seguimiento una vez lo tengamos.
        </span>
      </content-block>
      <content-block class="px-5">
        <header-title class="">
          <span class="text-2xl font-bold">¿COMPRAN COMICS?</span>
        </header-title>
        <span class="font-medium"> No compramos comics de segunda mano. </span>
      </content-block>
      <content-block class="px-5">
        <header-title class="">
          <span class="text-2xl font-bold">¿ACEPTAN DEVOLUCIONES?</span>
        </header-title>
        <span class="font-medium"> En caso de querer una devolución contactarse a nuestro instagram o acercarse al local. </span>
      </content-block>
    </div>
  </div>
</template>
