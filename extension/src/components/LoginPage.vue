<script setup lang="ts">
import axios from 'axios'
import { ref, watch , defineEmits  } from 'vue'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faEye } from '@fortawesome/free-solid-svg-icons'
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { useToast } from 'vue-toastification'
import RegisterPage from './RegisterPage.vue'

const email = ref<string>('')
const password = ref<string>('')

const toast = useToast()

const passwordFieldType = ref('password')

const loginPage = ref<boolean>(true)

const togglePasswordVisibility = () => {
  passwordFieldType.value = passwordFieldType.value === 'password' ? 'text' : 'password'
}

const emptyInput = ref<boolean>(true)

watch([email, password], () => {
  if (email.value && password.value) {
    console.log('email and password found')
    emptyInput.value = false
  } else {
    console.log('email or password not found')
    emptyInput.value = true
  }
})

// burayı koyduktan sonra hata çıktı
const emit = defineEmits<{
  (e: 'mainPage', isLoggedIn: boolean): void;
  (e: 'token', token: string): void;
  (e : 'page', page: string): void;
}>();

const login = async () => {
  console.log(email.value + ' ' + password.value)

  if (email.value && password.value) {
    const bodyFormData = {
      email: email.value,
      password: password.value
    }

    try {
      const response = await axios.post('http://localhost:5000/auth/login', bodyFormData, {
        headers: {
          'Content-Type': 'application/json'
        }
      })

      console.log(response.data)

      if (response.status) {
        toast.success('Login successful')
        /*    localStorage.setItem('token', response.data.token); */
        localStorage.setItem('token', response.data.token)
        emit('token', response.data.token)
        emit('mainPage', true)
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error('Axios error status:', err.response?.status)
        console.error('Axios error data:', err.response?.data)

        toast.error(err.response?.data.message)
      } else {
        console.error('Unexpected error:', err)
        console.log('Unexpected error occurred')
      }
    }
  } else {
    toast.error('Email or password input not found')
  }
}
</script>
<template>
  <div v-if="loginPage" class="m-0 flex h-screen w-full flex items-center justify-center">
    <div class="flex flex-col w-full items-center justify-center bg-[#FFFFFF] p-4">
      <div class="mx-a ml-4 flex w-[90%] flex-col items-center justify-center">
        <div class="font-900 mb-4 text-3xl text-[#2C39A6]">Giriş</div>
        <div class="mt-2 flex w-full flex-col items-center justify-center gap-4">
          <div class="relative w-[85%]">
            <input
              v-model="email"
              placeholder=""
              type="email"
              class="inputt bg-#F2F2F2 w-full rounded-lg p-4 text-black"
            />
            <label>Email</label>
          </div>

          <div class="relative w-[85%]">
            <input
              v-model="password"
              placeholder=""
              :type="passwordFieldType"
              class="inputt bg-#F2F2F2 w-full rounded-lg p-4 text-black focus:border-[#2C39A6]"
            />
            <label>Password</label>
            <FontAwesomeIcon
              @click="togglePasswordVisibility"
              :icon="passwordFieldType === 'password' ? faEye : faEyeSlash"
              class="absolute right-4 top-0 mt-5 w-5 cursor-pointer"
              style="color: #6f6f6f"
            />
          </div>

          <div class="mt-2 flex gap-4">
            <button
              class="font-500 cursor-pointer text-lg rounded-md border-none bg-[#FFFFFF] p-4 text-[#2C39A6] transition-colors duration-300 ease-in-out hover:bg-[#E7E8EE]"
              @click="$emit('page', 'register')"
            >
              Kayıt ol
            </button>

            <button
              class="font-500 cursor-pointer text-lg rounded-md border-none bg-[#FFFFFF] p-4 text-[#2C39A6] transition-colors duration-300 ease-in-out hover:bg-[#E7E8EE]"
              @click="login"
              :disabled="emptyInput"
              :class="emptyInput ? 'tooltip cursor-not-allowed' : 'cursor-pointer'"
            >
              Giriş
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <RegisterPage />
  </div>
  <div class="absolute bottom-0 right-0">
    <img width="50" src="../../public/efilliBar.svg" alt="Logo" />
  </div>
</template>

<style scoped>
.tooltip {
  position: relative;
  display: inline-block;
}

.tooltip:hover::after {
  content: 'Email ve şifrenizi giriniz';
  position: absolute;
  background-color: #888ad3;
  color: white;
  padding: 5px;
  border-radius: 4px;
  font-size: 14px;
  top: 100%;
  left: 50%;
  margin-top: 5px;
  transform: translateX(-50%);
  white-space: nowrap;
}

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
  background-color: #f2f2f2;
}
.inputt:focus {
  border-color: #2c39a6 !important;
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
