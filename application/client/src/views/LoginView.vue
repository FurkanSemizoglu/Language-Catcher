<script setup lang="ts">

import axios from 'axios';
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useRouter } from 'vue-router';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useToast } from 'vue-toastification';


const email = ref<string>('');
const password = ref<string>('');
const router = useRouter();

const toast = useToast();

const passwordFieldType = ref('password');

const togglePasswordVisibility = () => {
  passwordFieldType.value = passwordFieldType.value === 'password' ? 'text' : 'password';
};

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

      } else {
        console.error('Unexpected error:', err);
        console.log('Unexpected error occurred');
      }
    }
  } else {
    toast.error('Email or password input not found');
  }
};
</script>
<template>
  <div class="m-0 flex h-screen w-full">
    <div class="relative flex w-full items-center justify-center bg-gray-100">
      <img
        src="../../public/world.jpg"
        alt="World"
        class="h-full max-h-full max-w-full object-cover rounded-md"
      />
      <div
        class="animate__animated animate__fadeInDown font-900 absolute flex items-center text-4xl text-white"
      >
        <!-- <img width="100" src="../../public/efilliBar.svg" alt="Logo" /> -->
        Efilli Dil Algılama Uygulaması
      </div>
    </div>
    <div class="flex w-2/5 flex-col items-center justify-center bg-[#FFFFFF] p-4">
      <div class=" mx-a ml-4 flex w-[90%] flex-col items-center justify-center">
        <div class="font-900 mb-4 text-3xl text-[#2C39A6]">Giriş</div>
        <div class="mt-2 flex w-full flex-col items-center justify-center gap-4">

          <div class="relative w-[85%]">
            <input
              v-model="email"
              placeholder=""
              type="email"
              class="inputt bg-#F2F2F2 w-full rounded-lg border-none p-4 text-black"
            />
            <label>Email</label>
          </div>

          <div class="relative w-[85%] ">
            <input
              v-model="password"
              placeholder=""
              :type="passwordFieldType"
              class="inputt bg-#F2F2F2 w-full rounded-lg border-none p-4 focus:border-[#2C39A6] text-black"
            />
            <label>Password</label>
            <FontAwesomeIcon
              @click="togglePasswordVisibility"
              :icon="passwordFieldType === 'password' ? faEye : faEyeSlash"
              class="absolute right-4 top-0 mt-5 cursor-pointer w-5"
              style="color: #6f6f6f"
            />
          </div>


          <div class="mt-2 flex gap-4">
            <RouterLink to="/register"
              ><button
                class="font-500 cursor-pointer rounded-md border-none bg-[#FFFFFF] p-4 text-[#2C39A6] transition-colors duration-300 ease-in-out hover:bg-[#E7E8EE]"
              >
                Kayıt ol
              </button>
            </RouterLink>

            <button
              class="font-500 cursor-pointer rounded-md border-none bg-[#FFFFFF] p-4 text-[#2C39A6] transition-colors duration-300 ease-in-out hover:bg-[#E7E8EE]"
              @click="login"
            >
              Giriş
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="absolute bottom-0 right-0">
    <img width="75" src="../../public/efilliBar.svg" alt="Logo" />
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
  background-color: #f2f2f2;
  color: gray;
  padding: 0 0.3rem;
  margin: 0 0.5rem;
  transition: 0.1s ease-out;
  transform-origin: left top;
  pointer-events: none;
}
.inputt {
  font-size: 1rem;
  outline: none;
  border: 0.5px solid #ffffff;
  padding: 1rem 0.7rem;
  transition: 0.1s ease-out;
  background-color: #F2F2F2;
}
.inputt:focus {
  border-color: #2c39a6  !important;
}
.inputt:focus + label {
  color: #2c39a6;
  top: 0;
  transform: translateY(-50%) scale(0.9);
}
.inputt:not(:placeholder-shown) + label {
  top: 0;
  transform: translateY(-50%) scale(0.9);
}
</style>

