<script setup>
import { RouterView } from "vue-router";
import NavBar from "./components/frontend/layout/Navbar.vue";
import Footer from "./components/frontend/layout/Footer.vue";
</script>

<template>
  <NavBar />
  <RouterView class="bg-background" />
  <Footer />
</template>
