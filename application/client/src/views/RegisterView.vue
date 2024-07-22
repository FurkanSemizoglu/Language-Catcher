<script setup lang="ts">

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
          <input type="email" placeholder="Email" class="border p-2 w-full rounded" />
          <input type="password" placeholder="Password" class="border p-2 w-full rounded" />
          <input type="password" placeholder="Password tekrar giriniz" class="border p-2 w-full rounded" />
          <div class="text-blue-500 cursor-pointer">şifremi unuttum</div>
          <div class="flex gap-4">
            <button class="bg-blue-500 text-white p-2 rounded cursor-pointer">Kayıt ol</button>          
          </div>
        </div>
      </div>
    </div>
  </template>