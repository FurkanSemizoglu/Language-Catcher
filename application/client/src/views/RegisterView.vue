<script setup lang="ts">
import axios from 'axios';
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useRouter } from 'vue-router';
const email = ref<string>('');
const password = ref<string>('');
const password2 = ref<string>('');

import { useToast } from 'vue-toastification';

const toast = useToast();
const router = useRouter();

const register = async () => {
  if (email.value && password.value && password2.value) {
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
    toast.error('Email or password input not found');
  }

  if (password.value !== password2.value) {
    toast.error('Passwords do not match');
    return;
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
      <div class="animate__animated animate__fadeInDown font-900 absolute text-4xl text-white">
        Efilli Dil Algılama Uygulaması
      </div>
    </div>
    <div class="flex w-2/5 flex-col items-center justify-center bg-[#FFFFFF] p-4">
      <div class="flex flex-col items-center w-3/4 ">
        <div class="font-900 mb-4 text-3xl text-[#2C39A6]">Kayıt Ol</div>
        <div class="flex w-full flex-col items-center gap-4">
          <input
            v-model="email"
            type="email"
            placeholder="Email"
            class="w-full rounded-md border-none p-4 bg-#F2F2F2"
          />
     <!--      <div class="relative w-full">
            <input placeholder="" type="email" class="w-full p-4" />
            <label>Email</label>
          </div>
          <div class="relative w-full">
            <input placeholder="" type="email" class="w-full p-4" />
            <label>Email</label>
          </div>
          <div class="relative w-full">
            <input placeholder="" type="email" class="w-full p-4" />
            <label>Email</label>
          </div>
          <div class="relative w-full">
            <input placeholder="" type="email" class="w-full p-4" />
            <label>Email</label>
          </div> -->

          <input
            v-model="password"
            type="password"
            placeholder="Password"
            class="w-full rounded-md border-none p-4 bg-#F2F2F2"             
          />
          <input
            v-model="password2"
            type="password"
            placeholder="Password tekrar giriniz"
            class="w-full rounded-md border-none p-4 bg-#F2F2F2"
          />
          <div class="flex gap-4">
            <button
              @click="register"
              class="cursor-pointer rounded-md border-none font-500 bg-[#FFFFFF] p-4 text-[#2C39A6] transition-colors duration-300 ease-in-out hover:bg-[#E7E8EE]"
            >
              Kayıt ol
            </button>
          </div>
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
  background-color: white;
  color: gray;
  padding: 0 0.3rem;
  margin: 0 0.5rem;
  transition: 0.1s ease-out;
  transform-origin: left top;
  pointer-events: none;
}
input {
  font-size: 1rem;
  outline: none;
/*   border: 1px solid gray;
  border-radius: 5px; */
  padding: 1rem 0.7rem;
  color: gray;
  transition: 0.1s ease-out;
}
/* input:focus {
  border-color: #6200EE;  
} */
input:focus + label {
  top: 0;
  transform: translateY(-50%) scale(0.9);
}
input:not(:placeholder-shown) + label {
  top: 0;
  transform: translateY(-50%) scale(0.9);
}
</style>
