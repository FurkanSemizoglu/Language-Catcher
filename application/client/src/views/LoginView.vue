<script setup lang="ts">
import { AsyncLocalStorage } from 'async_hooks';
import axios from 'axios';
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useRouter } from 'vue-router';
const email = ref<string>('');
const password = ref<string>('');
const router = useRouter();

import { useToast } from 'vue-toastification';

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

      if (response.status) {
        toast.success('Login successful');
        /*    localStorage.setItem('token', response.data.token); */
        localStorage.setItem('token', response.data.token);
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
    toast.error('Email or password input not found');
    /* console.log('Email or password input not found'); */
  }
};
</script>
<template>
  <div class="m-0 flex h-screen w-full">
    <div class="relative flex w-full items-center justify-center bg-gray-100">
      <img
        src="../../public/world.jpg"
        alt="World"
        class="h-full max-h-full w-full max-w-full object-cover"
      />
      <div class="animate__animated animate__fadeInDown font-900 absolute text-4xl text-white">
        Efilli Dil Algılama Uygulaması
      </div>
    </div>
    <div class="flex w-2/5 flex-col items-center justify-center bg-[#FFFFFF] p-4">
      <div class="font-900 mb-4 text-3xl text-[#2C39A6]">Giriş</div>
      <div class="flex w-3/4 flex-col items-center gap-4 mr-3">
        <!-- <input
          v-model="email"
          type="email"
          placeholder="Email"
          class="bg-#F2F2F2 w-full rounded-lg border-none p-4"
        /> -->
   <!--      <div class="w-full">
          <input
            v-model="password"
            type="password"
            placeholder="Password"
            class="bg-#F2F2F2 w-full rounded-lg border-none p-4"
          />
        </div>
        <div class="w-full">
          <input
            v-model="password"
            type="password"
            placeholder="Password"
            class="bg-#F2F2F2 w-full rounded-lg border-none p-4"
          />
        </div> -->
        <div class="relative w-full">
          <input placeholder="" type="email" class="inputt rounded-lg w-full p-4 bg-#F2F2F2 border-none text-black" />
          <label>Email</label>
        </div>

        <div class="relative w-full">
          <input placeholder="" type="password" class="inputt rounded-lg w-full p-4 bg-#F2F2F2 border-none" />
          <label>Password</label>
        </div>

        <!--    <div class="relative mb-2 w-full">
          <div class="absolute left-0 cursor-pointer text-lg text-blue-500">şifremi unuttum</div>
        </div> -->

        <div class="mt-2 flex gap-4">
          <RouterLink to="/register"
            ><button
              class="font-500 cursor-pointer rounded-md border-none bg-[#FFFFFF] p-4 text-[#2C39A6] hover:bg-[#E7E8EE]"
            >
              Kayıt ol
            </button>
          </RouterLink>

          <button
            class="font-500 cursor-pointer rounded-md border-none bg-[#FFFFFF] p-4 text-[#2C39A6] hover:bg-[#E7E8EE]"
            @click="login"
          >
            Giriş
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.material-textfield {
  position: relative;
}

label {
  position: absolute;
  font-size: 1rem;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  background-color: #F2F2F2;
  color: gray;
  padding: 0 0.3rem;
  margin: 0 0.5rem;
  transition: .1s ease-out;
  transform-origin: left top;
  pointer-events: none;
}
.inputt {
  font-size: 1rem;
  outline: none;
  border: 0.5px solid #FFFFFF;

  padding: 1rem 0.7rem;
 
  transition: 0.1s ease-out;
}
input:focus {
  border-color: #2C39A6;  
}
.inputt:focus + label {
  color: #2C39A6;
  top: 0;
  transform: translateY(-50%) scale(0.9);
}
.inputt:not(:placeholder-shown) + label {
  top: 0;
  transform: translateY(-50%) scale(0.9);
}
</style>
