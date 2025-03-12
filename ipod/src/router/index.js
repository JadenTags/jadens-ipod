import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import MenuView from '@/views/MenuView.vue';
import iPodView from '@/views/iPodView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView
    },
    {
      path: '/home',
      name: 'home',
      component: iPodView
    },
    // {
    //   path: '/player',
    //   name: 'player',
    //   component: Player
    // }
  ]
});

export default router;
