<script setup lang="ts">
import { AsyncLocalStorage } from 'async_hooks';
import axios from 'axios';
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useRouter } from 'vue-router';
const email = ref<string>('');
const password = ref<string>('');
const router = useRouter();

import { useToast } from "vue-toastification";

const toast = useToast(); 


const login = async () => {
  console.log(email.value + ' ' + password.value);

 
  if (email.value && password.value) {
    const bodyFormData = {
      email: email.value,
      password: password.value
    };

    try {
      const response = await axios.post('http://localhost:5000/auth/login', bodyFormData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log(response.data);
      localStorage.setItem('YourItem', response.data)
      if (response.status) {
        toast.success('Login successful');
     /*    localStorage.setItem('token', response.data.token); */
        router.push('/home');
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error('Axios error status:', err.response?.status);
        console.error('Axios error data:', err.response?.data);

        toast.error(err.response?.data.message);
/* 
        if (err.response?.status === 400) {
          console.log(`Error 400: ${err.response.data.message}`);
        } else if (err.response?.status === 401) {
          console.log(`Error 401: ${err.response.data.message}`);
        } else {
          console.log(`Error: ${err.response?.data?.message || 'An error occurred'}`);
        } */
      } else {
        console.error('Unexpected error:', err);
        console.log('Unexpected error occurred');
      }
    }
  } else {
    toast.error("Email or password input not found");
    /* console.log('Email or password input not found'); */
  }
};
</script>
<template>
  <div class="flex h-screen">
    <div class="relative flex w-full items-center justify-center bg-gray-100">
      <img
        src="../../public/world.jpg"
        alt="World"
        class="h-full max-h-full max-w-full object-cover"
      />
      <div class="font-900 absolute text-4xl text-white">Efilli Dil Algılama Uygulaması</div>
    </div>
    <div class="flex w-2/5 flex-col items-center justify-center bg-[#010C1D] p-4">
      <div class="font-900 mb-4 text-3xl text-white">Giriş</div>
      <div class="flex w-3/4 flex-col items-center gap-4">
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          class="w-full rounded-xl border p-4"
        />
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="w-full rounded-xl border p-4"
        />
        <!--    <div class="relative mb-2 w-full">
          <div class="absolute left-0 cursor-pointer text-lg text-blue-500">şifremi unuttum</div>
        </div> -->

        <div class="mt-2 flex gap-4">
          <RouterLink to="/register"
            ><button
              class="cursor-pointer rounded-xl border bg-blue-500 p-4 text-white hover:bg-blue-600"
            >
              Kayıt ol
            </button>
          </RouterLink>

          <button
            class="cursor-pointer rounded-xl border bg-green-500 p-4 text-white hover:bg-green-600"
            @click="login"
          >
            Giriş
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
