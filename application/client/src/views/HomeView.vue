<script setup lang="ts">
import { ref } from 'vue';
const token  = ref<string|null>(''); 
token.value= localStorage.getItem('token');

</script>

<template>Main screeen   {{ token }}</template>