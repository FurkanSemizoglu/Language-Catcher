<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink } from 'vue-router';

const email = ref<string>('');
const password = ref<string>('');

const login = () => {
  console.log(email.value + ' ' + password.value);
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

        <div class="flex mt-2 gap-4">
          <RouterLink to="/register"
            ><button
              class="bg-blue-500 cursor-pointer rounded-xl border p-4 text-white hover:bg-blue-600"
            >
              Kayıt ol
            </button>
          </RouterLink>

          <button class="cursor-pointer rounded-xl bg-green-500 border p-4 text-white hover:bg-green-600" @click="login">
            Giriş
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
