<script setup lang="ts">
import axios from 'axios';
import { onMounted, ref } from 'vue';
const token  = ref<string|null>(''); 
const user  = ref<string|null>('');
token.value= localStorage.getItem('token');


onMounted(async() => {
  console.log('token', token.value);

  const response = await axios.post('http://localhost:5000/auth/user', {
    token: token.value
  });

    console.log(response.data);
    console.log("email " , response.data.user.email);
    user.value = response.data.user.email;
});

</script>

<template>Hoşgeldiniz sayın {{ user }}</template>