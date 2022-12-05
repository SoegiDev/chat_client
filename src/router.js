import { createWebHistory, createRouter } from "vue-router";


  const routes = [
    {
        path: '/',
        name: 'chat_home',
        component: () => import('../src/pages/Chat.vue')
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../src/pages/Login.vue')
    },
    {
      path: '/register',
      name: 'register_form',
      component: () => import('../src/pages/Register.vue')
  },

]

const router = createRouter({
    history: createWebHistory(),
    routes,
  });

export default router
router.beforeEach((to, from, next) => {
    const publicPages = ['/login','/register'];
    const authRequired = !publicPages.includes(to.path);
    const sessiondata = localStorage.getItem(process.env.VUE_APP_KEY_STORAGE);

    if (authRequired && !sessiondata) {
      next({name:'login'});
    } else {
      next();
    }
  });