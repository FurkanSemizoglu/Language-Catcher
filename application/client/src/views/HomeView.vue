<script setup lang="ts">
import axios from 'axios';
import { onMounted, ref } from 'vue';

const token = ref<string | null>('');
const user = ref<string | null>('');
const url = ref<string>('');
let loadingButton = ref<boolean>(false);

import { useToast } from 'vue-toastification';
import UrlCard from '../components/UrlCard.vue';
import { extensionResult } from '../types';

const toast = useToast();
token.value = localStorage.getItem('token');

const returnedValues = ref<extensionResult[]>([]);

window.addEventListener('languageCatcherResult', async (e) => {
  loadingButton.value = false;
  console.log('Result from extension', e);
  const event = e as CustomEvent;
  const language = event.detail.language;

  try {
    const response = await axios.post('http://localhost:5000/api/addLanguage', {
      email: user.value,
      languageData: event.detail
    });

    console.log('abi gitti artık ', response.data);
  } catch (error) {
    console.log(error);
  }

  returnedValues.value.push(event.detail);
  console.log(language);
  console.log('array : ', returnedValues.value);
  url.value = '';
});

onMounted(async () => {
  console.log('token', token.value);

  try {
    const response = await axios.post('http://localhost:5000/auth/user', {
      token: token.value
    });

    console.log(response.data);
    user.value = response.data.user.email;

    const languagesResponse = await axios.get('http://localhost:5000/api/getUserLanguages', {
      params: { email: response.data.user.email }
    });

    console.log('languagesss', languagesResponse.data);
    console.log('email ', response.data.user.email);
    user.value = response.data.user.email;
  } catch (error) {
    console.log(error);
  }
});

const sendUrlToExtension = () => {
  console.log(url.value);
  loadingButton.value = true;

  if (url.value === '' || !url.value.includes('http')) {
    loadingButton.value = false;
    toast.error('Url geçerli değil');
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

const logout = async () => {
  const response = await axios.get('http://localhost:5000/auth/logout');

  localStorage.removeItem('token');
  window.location.href = '/';
};
</script>

<template>
  <div>
    <div class="topBar m-a flex w-full items-center justify-between px-8 py-6">
      <div class="cursor-pointer text-[#888AD3] hover:text-[#C0C5E5]">{{ user }}</div>

      <div class="mr-3 cursor-pointer text-[#888AD3] hover:text-[#C0C5E5]" @click="logout">
        Çıkış Yap
      </div>
    </div>
    <div class="m-a mt-5 w-4/5">
      <div class="m-a relative mt-8 inline-block flex w-[600px] items-center justify-center">
        <input
          type="text"
          v-model="url"
          placeholder="Dil algılamak için url giriniz..."
          class="bg-#F2F2F2 border-b-coolGray w-full rounded-3xl p-4 focus:border-none focus:outline-[#DCE2EE]"
        />
        <button
          class="absolute right-0 rounded-r-3xl bg-[#0059F7] p-4 text-white transition duration-300 ease-in-out hover:bg-[#3E83F7]"
          @click="sendUrlToExtension"
        >
          Search
        </button>
      </div>

      <div class="mt-20">
        <div class="cols-4 font-600 grid rounded-md border border-gray-300">
          <div class="h-full w-full rounded-md border border-gray-300 p-4 text-[#273464]">URL</div>
          <div class="h-full w-full rounded-md border border-gray-300 p-4 text-[#273464]">
            LANGUAGE
          </div>
          <div class="h-full w-full rounded-md border border-gray-300 p-4 text-[#273464]">
            <div>DETECTED PLACES</div>
          </div>
          <div class="h-full w-full rounded-md border border-gray-300 p-4 text-[#273464]">
            <div>ACCURACY</div>
          </div>
        </div>

        <div v-for="(value, index) in returnedValues" :key="index">
          <UrlCard
            :url="value.domain"
            :detected-language="value.language"
            :detected-places="value.languageFetchedFrom"
            :language-location="value.languageLocation"
            :lang-name="value.langName"
            :lang-native-name="value.langNativeName"
            :accuracy="value.languageAccuracy"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
td,
th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}

th {
  color: #373ba6;
}

.detailTransition-enter-active,
.detailTransition-leave-active {
  transition: opacity 0.5s ease;
}

.detailTransition-enter-from,
.detailTransition-leave-to {
  opacity: 0;
}
</style>
