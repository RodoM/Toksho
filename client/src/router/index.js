import { computed } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { userStore } from "@/stores/index.js";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: () => import("@/views/frontend/HomeView.vue"),
      meta: {
        label: "Inicio",
        auth: false,
      },
    },
    {
      path: "/productos",
      name: "Products",
      component: () => import("@/views/frontend/ProductsView.vue"),
      meta: {
        label: "Productos",
        auth: false,
      },
    },
    {
      path: "/productos/:id:/:name",
      name: "Product",
      component: () => import("@/views/frontend/ProductDetail.vue"),
      meta: {
        label: "Producto",
        auth: false,
      },
    },
    {
      path: "/preguntas",
      name: "Questions",
      component: () => import("@/views/frontend/FaqView.vue"),
      meta: {
        label: "Preguntas",
        auth: false,
      },
    },
    {
      path: "/contacto",
      name: "Contact",
      component: () => import("@/views/frontend/ContactView.vue"),
      meta: {
        label: "Contacto",
        auth: false,
      },
    },
    {
      path: "/ingresar",
      name: "Login",
      component: () => import("@/views/LoginView.vue"),
      meta: {
        label: "Ingresar",
        auth: false,
      },
    },
    {
      path: "/registro",
      name: "Register",
      component: () => import("@/views/RegisterView.vue"),
      meta: {
        label: "Registrarse",
        auth: false,
      },
    },
    {
      path: "/olvide-contrasena",
      name: "ForgotPassword",
      component: () => import("@/views/ForgotPasswordView.vue"),
      meta: {
        label: "Olvide contraseña",
        auth: false,
      },
    },
    {
      path: "/restablecer-contrasena",
      name: "RestorePassword",
      component: () => import("@/views/RestorePasswordView.vue"),
      meta: {
        label: "Restablecer contraseña",
        auth: false,
      },
    },
    {
      path: "/perfil",
      name: "Profile",
      component: () => import("@/views/frontend/ProfileView.vue"),
      meta: {
        label: "Perfil",
        auth: true,
      },
    },
    {
      path: "/carrito",
      name: "Cart",
      component: () => import("@/views/frontend/CartView.vue"),
      meta: {
        label: "Carrito",
        auth: false,
      },
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },
    {
      path: "/admin/listado",
      name: "Stock",
      component: () => import("@/views/admin/ProductStockView.vue"),
      meta: {
        label: "Listado",
        auth: true,
        adminAuth: true,
      },
    },
    {
      path: "/admin/ordenes",
      name: "Orders",
      component: () => import("@/views/admin/OrdersView.vue"),
      meta: {
        label: "Ordenes",
        auth: true,
        adminAuth: true,
      },
    },
    {
      path: "/admin/configuraciones",
      name: "News",
      component: () => import("@/views/admin/SettingsView.vue"),
      meta: {
        label: "Configuraciones",
        auth: true,
        adminAuth: true,
      },
    },
    {
      path: "/admin/agregar-producto",
      name: "AddProduct",
      component: () => import("@/views/admin/AddProductView.vue"),
      meta: {
        label: "Agregar producto",
        auth: true,
        adminAuth: true,
      },
    },
    {
      path: "/admin/editar-producto/:id",
      name: "EditProduct",
      component: () => import("@/views/admin/EditProductView.vue"),
      meta: {
        label: "Editar producto",
        auth: true,
        adminAuth: true,
      },
    },
    {
      path: "/admin/ver-producto/:id",
      name: "SeeProduct",
      component: () => import("@/views/admin/SeeProductView.vue"),
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
  if (
    (to.meta.label === "Ingresar" || to.meta.label === "Registrarse") &&
    user.value
  ) {
    next("/");
  } else if (to.meta.auth && to.meta.adminAuth && !user.value?.isAdmin) {
    next("/");
  } else if (to.meta.auth && !user.value) {
    next("/ingresar");
  } else {
    next();
  }
});

export default router;
