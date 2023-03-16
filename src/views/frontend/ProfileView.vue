<script setup>
import { supabase } from "@/supabase/supabase.js";

const userData = async () => {
  const { data, error } = await supabase.from("users").select("*");
  if (error) console.log(error);
  else console.log(data[0].cart_items);
};

const updateCart = async () => {
  const { error } = await supabase
    .from("users")
    .update({ cart_items: [{ id: 1, quantity: 1 }] })
    .eq("id", "82a17c78-615e-4229-ba5f-9294095e16e1");
  if (error) console.log(error);
};

// para eliminar un elemento del carrito consultamos el mismo al acceder a la vista del mismo
// y lo guardamos en una variable, al eliminar buscamos el elemento con find, conseguimos su index
// y lo eliminamos del array.
// OPC 1: Con un watcher cada vez que eliminemos un item del carrito volveremos a consultar el mismo para actualizarlo
// y sobreescribir la variable del carrito con el nuevo.
// OPC 2: Mostramos en la vista el carrito guardado en la variable y al continuar de paso o retirarse de la vista
// actualizamos el carrito de la db.
</script>

<template>
  <div class="container py-5 mx-auto">
    <button @click="userData">data</button>
    <br />
    <button @click="updateCart">actualizar carrito</button>
    <br />
  </div>
</template>
