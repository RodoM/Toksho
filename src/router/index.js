import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/frontend/HomeView.vue";
import Products from "@/views/frontend/ProductsView.vue";
import ProductDetail from "@/views/frontend/ProductDetail.vue";
import Faq from "@/views/frontend/FaqView.vue";
import Contact from "@/views/frontend/ContactView.vue";
import Login from "@/views/LoginView.vue";
import Register from "@/views/RegisterView.vue";
import NotFound from "@/views/404View.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Inicio",
      component: Home,
    },
    {
      path: "/productos",
      name: "Productos",
      component: Products,
    },
    {
      path: "/productos/:id:/:name",
      name: "Producto",
      component: ProductDetail,
    },
    {
      path: "/preguntas",
      name: "Preguntas",
      component: Faq,
    },
    {
      path: "/contacto",
      name: "Contacto",
      component: Contact,
    },
    {
      path: "/ingresar",
      name: "Ingresar",
      component: Login,
    },
    {
      path: "/registro",
      name: "Registrarse",
      component: Register,
    },
    {
      path: "/:pathMatch(.*)*",
      name: "Sin resultado",
      component: NotFound,
    },
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;
