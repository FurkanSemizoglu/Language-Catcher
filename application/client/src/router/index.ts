import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import axios from 'axios';


const isAuthenticated  =  async() : Promise<boolean> => {
  const token = localStorage.getItem('token');
  // Bu yeterli mi ?
  /* if (!token) return false;
  return true; */
  console.log("token var ve çalışmalı" , token);

  if (!token) return false;

  // aslında buna gerek yok çünkü token varsa zaten user var demektir.
  const response = await axios.post('http://localhost:5000/auth/user', {
    token: token
  });

  if (response.data.status === 'failed'){
    console.log("burası");
    localStorage.removeItem('token');
    window.location.href = '/';
    return false;
  } 
  return response.data.status === 'OK' ? true : false;

}



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/RegisterView.vue')
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
  ]
})

router.beforeEach( async(to, from, next) => {
  if (to.name !== 'home' && (await isAuthenticated() === true)) {
    console.log("burada çalışcak");
    next({ name: 'home' })
  }
  else if(to.name === 'home' && (await isAuthenticated() === false)){
    next({ name: 'login' })
  }
  else next()
})

export default router
