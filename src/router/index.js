import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '../store/user';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import TodoListView from '../views/TodoListView.vue';

const routes = [
  { path: '/login', component: LoginView, meta: { guest: true } },
  { path: '/register', component: RegisterView, meta: { guest: true } },
  { path: '/', component: TodoListView, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  userStore.loadUser();
  if (to.meta.requiresAuth && !userStore.user) {
    next('/login');
  } else if (to.meta.guest && userStore.user) {
    next('/');
  } else {
    next();
  }
});

export default router;
