import { createRouter, createWebHistory } from "vue-router"
import { useAuthStore } from "../stores/auth"

import LoginView from "../views/LoginView.vue"
import UsersView from "../views/UsersView.vue"
import UserDetailView from "../views/UserDetailView.vue"
import ProductsView from "../views/ProductsView.vue"
import ProductDetailView from "../views/ProductDetailView.vue"

const routes = [
  { path: "/login", name: "login", component: LoginView, meta: { requiresAuth: false } },
  { path: "/", redirect: "/users" },
  { path: "/users", name: "users", component: UsersView, meta: { requiresAuth: true } },
  { path: "/users/:id", name: "user-detail", component: UserDetailView, meta: { requiresAuth: true } },
  { path: "/products", name: "products", component: ProductsView, meta: { requiresAuth: true } },
  { path: "/products/:id", name: "product-detail", component: ProductDetailView, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 🔒 Router Guard
router.beforeEach((to) => {
  const auth = useAuthStore()

  // kalau butuh login dan belum login → redirect ke login
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { path: "/login", replace: true }
  }

  // kalau udah login, jangan bisa balik ke /login lagi
  if (to.name === "login" && auth.isAuthenticated) {
    return { path: "/users", replace: true }
  }
})

export default router
