import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import Player from '@/views/PlayerView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView
    },
    {
      path: '/player',
      name: 'player',
      component: Player
    }
  ]
});

export default router;
