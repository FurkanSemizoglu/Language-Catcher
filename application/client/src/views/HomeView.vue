<script setup lang="ts">
import axios from 'axios';
import { onMounted, ref } from 'vue';
const token = ref<string | null>('');
const user = ref<string | null>('');

const url = ref<string>('');
token.value = localStorage.getItem('token');

const returnedValues = ref<string[]>([])

window.addEventListener('languageCatcherResult' , (e) => {
  console.log('Result from extension' , e)
  const event = e as CustomEvent
  const language = event.detail.language
  console.log("language" , language);
  returnedValues.value.push(event.detail)
  console.log(language)
  console.log("array : "  ,returnedValues.value)
})


onMounted(async () => {
  console.log('token', token.value);

  const response = await axios.post('http://localhost:5000/auth/user', {
    token: token.value
  });

  console.log(response.data);
  console.log('email ', response.data.user.email);
  user.value = response.data.user.email;
});

import Buttonn from 'primevue/button';



const sendUrlToExtension = () => {
  console.log(url.value)
  
  const sendedURL = new CustomEvent('language-catcher-start', {
        detail: {
          status: 'OK',
          url: url.value
        }
      })

  window.dispatchEvent(sendedURL)

}
</script>

<template>
  <InputText v-model="url" type="text" size="large" placeholder="Large" />
  <Buttonn type="button" label="Search" icon="pi pi-search"  @click="sendUrlToExtension" />

</template>
