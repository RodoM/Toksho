import { computed } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { userStore } from "@/stores/index.js";

import Home from "@/views/frontend/HomeView.vue";
import Products from "@/views/frontend/ProductsView.vue";
import ProductDetail from "@/views/frontend/ProductDetail.vue";
import Faq from "@/views/frontend/FaqView.vue";
import Contact from "@/views/frontend/ContactView.vue";
import Login from "@/views/LoginView.vue";
import Register from "@/views/RegisterView.vue";
import Cart from "@/views/frontend/CartView.vue";
import Profile from "@/views/frontend/ProfileView.vue";
import NotFound from "@/views/404View.vue";

import ProductStockView from "@/views/admin/ProductStockView.vue";
import AddProductView from "@/views/admin/AddProductView.vue";
import EditProductView from "@/views/admin/EditProductView.vue";
import SeeProductView from "@/views/admin/SeeProductView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home,
      meta: {
        label: "Inicio",
        auth: false,
      },
    },
    {
      path: "/productos",
      name: "Products",
      component: Products,
      meta: {
        label: "Productos",
        auth: false,
      },
    },
    {
      path: "/productos/:id:/:name",
      name: "Product",
      component: ProductDetail,
      meta: {
        label: "Producto",
        auth: false,
      },
    },
    {
      path: "/preguntas",
      name: "Questions",
      component: Faq,
      meta: {
        label: "Preguntas",
        auth: false,
      },
    },
    {
      path: "/contacto",
      name: "Contact",
      component: Contact,
      meta: {
        label: "Contacto",
        auth: false,
      },
    },
    {
      path: "/ingresar",
      name: "Login",
      component: Login,
      meta: {
        label: "Ingresar",
        auth: false,
      },
    },
    {
      path: "/registro",
      name: "Register",
      component: Register,
      meta: {
        label: "Registrarse",
        auth: false,
      },
    },
    {
      path: "/perfil",
      name: "Profile",
      component: Profile,
      meta: {
        label: "Perfil",
        auth: true,
      },
    },
    {
      path: "/carrito",
      name: "Cart",
      component: Cart,
      meta: {
        label: "Carrito",
        auth: false,
      },
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NoResult",
      component: NotFound,
      meta: {
        label: "Sin Resultado",
        auth: false,
      },
    },
    {
      path: "/admin/listado",
      name: "Stock",
      component: ProductStockView,
      meta: {
        label: "Listado",
        auth: true,
        adminAuth: true,
      },
    },
    {
      path: "/admin/agregar-producto",
      name: "AddProduct",
      component: AddProductView,
      meta: {
        label: "Agregar producto",
        auth: true,
        adminAuth: true,
      },
    },
    {
      path: "/admin/editar-producto/:id",
      name: "EditProduct",
      component: EditProductView,
      meta: {
        label: "Editar producto",
        auth: true,
        adminAuth: true,
      },
    },
    {
      path: "/admin/ver-producto/:id",
      name: "SeeProduct",
      component: SeeProductView,
      meta: {
        label: "Ver producto",
        auth: true,
        adminAuth: true,
      },
    },
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});

router.beforeEach(async (to, from, next) => {
  const store = userStore();
  const user = computed(() => store.user);
  if ((to.meta.label === "Ingresar" || to.meta.label === "Registrarse") && user.value) {
    next("/");
  } else if (to.meta.auth && to.meta.adminAuth && !user.value?.user_metadata.isAdmin) {
    next("/");
  } else if (to.meta.auth && !user.value) {
    next("/ingresar");
  } else {
    next();
  }
});

export default router;
