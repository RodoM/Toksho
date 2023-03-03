<script setup>
import ContentBlock from "@/components/shared/blocks/ContentBlock.vue";
import HeaderTitle from "@/components/frontend/headers/HeaderTitle.vue";
</script>

<template>
  <div class="container px-5 py-5 mx-auto">
    <div class="flex flex-col gap-5">
      <content-block class="px-5">
        <header-title class="">
          <span class="text-2xl font-bold">¿HACEN ENVIOS?</span>
        </header-title>
        <span class="font-medium">
          De momento no contamos con envios, en caso de realizar una compra se
          le reservara el/los productos y deberá retirarlos en el local.
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
          <span class="text-2xl font-bold">¿HAY DESCUENTOS?</span>
        </header-title>
        <span class="font-medium"> jajajajaja. </span>
      </content-block>
    </div>
  </div>
</template>
