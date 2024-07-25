<script setup lang="ts">
import axios from 'axios';
import { onMounted, ref } from 'vue';
import Buttonn from 'primevue/button';
const token = ref<string | null>('');
const user = ref<string | null>('');

const url = ref<string>('');
import { useToast } from 'vue-toastification';

const toast = useToast();
let loadingButton = ref<boolean>(false);
token.value = localStorage.getItem('token');

const returnedValues = ref<string[]>([]);

window.addEventListener('languageCatcherResult', (e) => {
  loadingButton.value = false;
  console.log('Result from extension', e);
  const event = e as CustomEvent;
  const language = event.detail.language;
  returnedValues.value.push(event.detail);
  console.log(language);
  console.log('array : ', returnedValues.value);
});

onMounted(async () => {
  console.log('token', token.value);

  const response = await axios.post('http://localhost:5000/auth/user', {
    token: token.value
  });

  console.log(response.data);
  console.log('email ', response.data.user.email);
  user.value = response.data.user.email;
});

const sendUrlToExtension = () => {
  console.log(url.value);
  loadingButton.value = true;

  if (url.value === '' || !url.value.includes('http')) {
    loadingButton.value = false;
    toast.error("Url geçerli değil");
    return;
  }
  const sendedURL = new CustomEvent('language-catcher-start', {
    detail: {
      status: 'OK',
      url: url.value
    }
  });

  window.dispatchEvent(sendedURL);
};
</script>

<template>
  <div class="topBar flex items-center justify-between w-4/5 m-a py-4">
    <div>Hoşgeldiniz {{ user }}</div>
    <div class="mr-3 flex items-center">
      <InputText v-model="url" type="text" placeholder="Large" class="p-8"  />
      <Button
        type="button"
        label="Search"
        icon="pi pi-search"
        :loading="loadingButton"
        @click="sendUrlToExtension"
        class="bg-blue-500 text-white"
        button.primary.color="blue"
      />
    </div>
    <div>Çıkış Yap</div>
  </div>
</template>
