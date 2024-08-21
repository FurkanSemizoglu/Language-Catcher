<script setup lang="ts">
import { ref, watch, defineEmits } from 'vue'
const email = ref<string>('')
const password = ref<string>('')
import { useToast } from 'vue-toastification'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faEye } from '@fortawesome/free-solid-svg-icons'
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
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
const emit = defineEmits<{
  (e: 'mainPage', isLoggedIn: boolean): void
  (e: 'token', token: string): void
  (e: 'page', page: string): void
}>()

const login = async () => {
  console.log(email.value + ' ' + password.value)

  if (email.value && password.value) {
    const bodyFormData = {
      email: email.value,
      password: password.value
    }

    try {
      /*  const response = await axios.post('http://localhost:5000/auth/login', bodyFormData, {
        headers: {
          'Content-Type': 'application/json'
        }
      }) */

      chrome.runtime.sendMessage(
        {
          message: 'login',
          bodyFormData: bodyFormData
        },
        (response) => {
          console.log(response)

          if (response.status) {
            toast.success('Login successful')
            /*    localStorage.setItem('token', response.data.token); */
            localStorage.setItem('token', response.token)
            emit('token', response.token)
            emit('mainPage', true)
          }
          else {
            toast.error(response.message)
          }
        }
      )

      /*     console.log(response.data)

      if (response.status) {
        toast.success('Login successful')
     
        localStorage.setItem('token', response.data.token)
        emit('token', response.data.token)
        emit('mainPage', true)
      } */
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
  <div class="mt-2 flex w-full flex items-center justify-center gap-2">
    <div class="relative w-[85%]">
      <!--   <input 
        placeholder=""
        type="email"
        class="h-30px bg-white border w-full  p-3 text-black"
        /> -->
      <input v-model="email" placeholder="Email" type="email" class="border border-[#2F33B0] p-2" />
    </div>

    <div class="relative w-full">
      <input
        v-model="password"
        placeholder="Password"
        :type="passwordFieldType"
        class="border border-[#2F33B0] p-2 w-full focus:border-[#2C39A6] focus:outline-[#DCE2EE]"
      />
      <FontAwesomeIcon
        @click="togglePasswordVisibility"
        :icon="passwordFieldType === 'password' ? faEye : faEyeSlash"
        class="iconClass top-0 mt-3 w-5 cursor-pointer"
        style="color: #6f6f6f"
      />

      <!--    <input class="inputt bg-#F2F2F2 w-full rounded-lg p-4 text-black focus:border-[#2C39A6]" />
      <label>Password</label> -->
    </div>

    <div class="flex gap-2 items-center">
      <button
        class="p-2 px-4 bg-[#2C39A6] font-300 text-white text-md transition duration-300 ease-in-out hover:bg-[#4B95FF]"
        @click="login"
      >
        Giriş
      </button>

      <button
        class="p-2 px-4 w-auto border border-[#2F33B0] text-[#2C39A6] font-300 bg-white text-md flex justify-center items-center"
        @click="$emit('page', 'register')"
      >
        Kayıt <span class="ml-1"> Ol</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.iconClass {
  position: absolute;
  right: 6px;
}

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
