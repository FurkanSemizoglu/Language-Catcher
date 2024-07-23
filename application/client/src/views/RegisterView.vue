<script setup lang="ts">
import axios from 'axios';
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useRouter } from 'vue-router';
const email = ref<string>('');
const password = ref<string>('');
const password2 = ref<string>('');

import { useToast } from "vue-toastification";

const toast = useToast(); 
const router = useRouter();

const register = async () => {

  if(email.value && password.value && password2.value){
    const bodyFormData = {
      email: email.value,
      password: password.value
    };

    try {
      const response = await axios.post('http://localhost:5000/auth/register', bodyFormData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log(response.data);

      if (response.status) {
        toast.success('Register successful');
        router.push('/');
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error('Axios error status:', err.response?.status);
        console.error('Axios error data:', err.response?.data);

        toast.error(err.response?.data.message);
      } else {
        console.error('Unexpected error:', err);
        console.log('Unexpected error occurred');
      }
    }
  } else {
    toast.error("Email or password input not found");
  }

  if(password.value !== password2.value){
    toast.error("Passwords do not match");
    return;
  }
}

</script>

<template>
    <div class="flex h-screen">
      <div class="w-3/5 flex items-center justify-center bg-gray-100 relative">
        <img src="../../public/world.jpg" alt="World" class="max-w-full max-h-full h-full object-cover" />
        <div class="absolute text-white text-2xl font-bold">
          Efilli Dil Algılama Uygulaması
        </div>
      </div>
      <div class="w-2/5 flex flex-col items-center justify-center bg-[#010C1D] p-4">
        <div class="mb-4 text-2xl text-white font-bold">kayıt ol</div>
        <div class="flex flex-col items-center gap-4 w-3/4">
          <input v-model="email" type="email" placeholder="Email" class="border p-2 w-full rounded" />
          <input v-model="password" type="password" placeholder="Password" class="border p-2 w-full rounded" />
          <input v-model="password2" type="password" placeholder="Password tekrar giriniz" class="border p-2 w-full rounded" />
          <div class="flex gap-4">
            <button @click="register" class="bg-blue-500 text-white p-2 rounded cursor-pointer">Kayıt ol</button>          
          </div>
        </div>
      </div>
    </div>
  </template>