<script setup>
import ProductSearchOptions from "@/components/shared/filters/ProductSearchOptions.vue";
import CustomButton from "@/lib/components/CustomButton.vue";
</script>

<template>
  <div class="container py-5 mx-auto">
    <div class="flex mx-5 border-2 border-tertiary-dark drop-shadow-items">
      <input
        type="text"
        placeholder="Busqueda..."
        class="w-full p-2 focus:outline-none"
      />
      <button
        class="p-2 border-l-2 material-icons-outlined border-tertiary-dark bg-primary-light"
      >
        search
      </button>
    </div>
    <div class="flex gap-3 p-5">
      <CustomButton primary class="w-full"> AGREGAR </CustomButton>
      <ProductSearchOptions />
    </div>
    <div class="px-5 overflow-x-auto whitespace-nowrap drop-shadow-items">
      <table class="table-fixed">
        <thead class="border-2 bg-primary border-tertiary-dark">
          <tr>
            <th class="px-5 text-start">NOMBRE</th>
            <th class="px-5">UNIDADES</th>
            <th class="px-5">PRECIO</th>
            <th class="px-5">DESCUENTO</th>
            <th class="px-5 text-start">ACCIONES</th>
          </tr>
        </thead>
        <tbody class="border-2 border-tertiary-dark">
          <tr class="min-w-[100px] bg-secondary-light">
            <td class="px-5 font-medium">Nombre del comic</td>
            <td class="px-5 font-medium">10</td>
            <td class="px-5 font-medium">$1200</td>
            <td class="px-5 font-medium">0%</td>
            <td class="flex gap-3 px-5 py-2">
              <button class="p-1 border-2 material-icons-outlined bg-primary-light border-tertiary-dark drop-shadow-navlink">edit</button>
              <button class="p-1 border-2 material-icons-outlined bg-primary-light border-tertiary-dark drop-shadow-navlink">delete</button>
              <button class="p-1 border-2 material-icons-outlined bg-primary-light border-tertiary-dark drop-shadow-navlink">visibility</button>
            </td>
          </tr>
          <tr class="min-w-[100px] bg-secondary">
            <td class="px-5 font-medium">Nombre del comic</td>
            <td class="px-5 font-medium">10</td>
            <td class="px-5 font-medium">$1200</td>
            <td class="px-5 font-medium">0%</td>
            <td class="flex gap-3 px-5 py-2">
              <button class="p-1 border-2 material-icons-outlined bg-primary-light border-tertiary-dark drop-shadow-navlink">edit</button>
              <button class="p-1 border-2 material-icons-outlined bg-primary-light border-tertiary-dark drop-shadow-navlink">delete</button>
              <button class="p-1 border-2 material-icons-outlined bg-primary-light border-tertiary-dark drop-shadow-navlink">visibility</button>
            </td>
          </tr>
          <tr class="min-w-[100px] bg-secondary-light">
            <td class="px-5 font-medium">Nombre del comic</td>
            <td class="px-5 font-medium">10</td>
            <td class="px-5 font-medium">$1200</td>
            <td class="px-5 font-medium">0%</td>
            <td class="flex gap-3 px-5 py-2">
              <button class="p-1 border-2 material-icons-outlined bg-primary-light border-tertiary-dark drop-shadow-navlink">edit</button>
              <button class="p-1 border-2 material-icons-outlined bg-primary-light border-tertiary-dark drop-shadow-navlink">delete</button>
              <button class="p-1 border-2 material-icons-outlined bg-primary-light border-tertiary-dark drop-shadow-navlink">visibility</button>
            </td>
          </tr>
          <tr class="min-w-[100px] bg-secondary">
            <td class="px-5 font-medium">Nombre del comic</td>
            <td class="px-5 font-medium">10</td>
            <td class="px-5 font-medium">$1200</td>
            <td class="px-5 font-medium">0%</td>
            <td class="flex gap-3 px-5 py-2">
              <button class="p-1 border-2 material-icons-outlined bg-primary-light border-tertiary-dark drop-shadow-navlink">edit</button>
              <button class="p-1 border-2 material-icons-outlined bg-primary-light border-tertiary-dark drop-shadow-navlink">delete</button>
              <button class="p-1 border-2 material-icons-outlined bg-primary-light border-tertiary-dark drop-shadow-navlink">visibility</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
