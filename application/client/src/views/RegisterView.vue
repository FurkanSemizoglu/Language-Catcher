<script setup lang="ts">
import axios from 'axios';
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useRouter } from 'vue-router';
const email = ref<string>('');
const password = ref<string>('');
const password2 = ref<string>('');

import { useToast } from 'vue-toastification';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const passwordFieldType = ref('password');
const passwordFieldType2 = ref('password');

const togglePasswordVisibility = () => {
  passwordFieldType.value = passwordFieldType.value === 'password' ? 'text' : 'password';
};

const togglePasswordVisibility2 = () => {
  passwordFieldType2.value = passwordFieldType2.value === 'password' ? 'text' : 'password';
};



const toast = useToast();
const router = useRouter();

const returnToLogin = () => {
  router.push('/');
};

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
        class="h-full max-h-full max-w-full object-cover rounded-md"
      />
      <div class="animate__animated animate__fadeInDown font-900 absolute text-4xl text-white">
        Efilli Dil Algılama Uygulaması
      </div>
    </div>
    <div class="flex w-2/5 flex-col items-center justify-center bg-[#FFFFFF] p-4">
      <div class="flex w-3/4 flex-col items-center">
        <div class="font-900 mb-4 text-3xl text-[#2C39A6]">Kayıt Ol</div>
        <div class="mr-3 flex w-full flex-col items-center gap-4">

          <div class="relative w-full">
            <input
              v-model="email"
              placeholder=""
              type="email"
              class="inputt bg-#F2F2F2 w-full rounded-lg border-none p-4 text-black"
            />
            <label>Email</label>
          </div>

          <div class="relative w-full">
            <input
              v-model="password"
              placeholder=""
              :type="passwordFieldType"
              class="inputt bg-#F2F2F2 w-full rounded-lg border-none p-4"
            />
            <label>Password</label>
            <FontAwesomeIcon
              @click="togglePasswordVisibility"
              :icon="passwordFieldType === 'password' ? faEye : faEyeSlash"
              class="absolute right-0 top-0 mt-5 cursor-pointer w-5"
              style="color: #6f6f6f"
            />
          </div>

          <div class="relative w-full">
            <input
              v-model="password2"
              :type="passwordFieldType2"
              placeholder=""
              class="inputt bg-#F2F2F2 w-full rounded-lg border-none p-4"
            />
            <label>Password</label>

            <FontAwesomeIcon
              @click="togglePasswordVisibility2"
              :icon="passwordFieldType2 === 'password' ? faEye : faEyeSlash"
              class="absolute right-0 top-0 mt-5 cursor-pointer w-5"
              style="color: #6f6f6f"
            />
          </div>

          <div class="flex gap-4">

            <button
              class="font-500 cursor-pointer rounded-md border-none bg-[#FFFFFF] p-4 text-[#2C39A6] transition-colors duration-300 ease-in-out hover:bg-[#E7E8EE]"
              @click="returnToLogin"
            >
            <FontAwesomeIcon :icon="faArrowLeft" class="mr-1" style="color: #373ba6;" />
              Girişe Dön
            </button>


            <button
              @click="register"
              class="font-500 cursor-pointer rounded-md border-none bg-[#FFFFFF] p-4 text-[#2C39A6] transition-colors duration-300 ease-in-out hover:bg-[#E7E8EE]"
            >
              Kayıt ol
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
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background-color: #f2f2f2;
  color: gray;
  padding: 0 0.3rem;
  margin: 0;
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
}
.inputt:focus {
  border-color: #2c39a6;
}
.inputt:focus + label,
.inputt:not(:placeholder-shown) + label {
  color: #2c39a6;
  top: 0;
  transform: translateY(-50%) scale(0.9);
}
</style>
