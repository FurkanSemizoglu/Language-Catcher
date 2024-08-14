<script setup lang="ts">
import LoginPage from './LoginPage.vue'
import RegisterPage from './RegisterPage.vue'
import { ref , defineEmits} from 'vue'

const loginPage = ref<boolean>(true)

const changePage = (page: string) => {
  if (page === 'register') {
    loginPage.value = false
  } else {
    loginPage.value = true
  }
}

const emit = defineEmits<{
  (e: 'mainPage', isLoggedIn: boolean): void;
  (e: 'token', token: string): void;
}>();

const mainPage = (isLoggedIn: boolean) => {
  emit('mainPage', isLoggedIn)
}

const token = (token: string) => {
  emit('token', token)
}
</script>

<template>
  <div v-if="loginPage">
    <LoginPage @page="changePage" @main-page="mainPage" @token="token"/>
  </div>
  <div v-else>
    <RegisterPage @page="changePage"/>
  </div>
</template>
