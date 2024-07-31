<script setup lang="ts">
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { extensionResult, extensionResponse } from '../types';

import { useToast } from 'vue-toastification';
import UrlCard from '../components/UrlCard.vue';
import LoadingBarCard from '../components/LoadingBarCard.vue';

const token = ref<string | null>('');
const user = ref<string>('');
const url = ref<string>('');
let loadingButton = ref<boolean>(false);
let extensionExist = ref<boolean>(true);
let appReady = ref<boolean>(false);

const toast = useToast();
token.value = localStorage.getItem('token');

const returnedValues = ref<extensionResult[]>([]);

/* window.addEventListener('updateProgress', (e) => {
  const event = e as CustomEvent;
  console.log('update progress :', event.detail.progress);
}); */

extensionExist.value = false;
// Burada hep dinleyebiliriz ya da sadece bi kere de dinlenebilir
window.addEventListener('language-catcher-exist', (e) => {
  const event = e as CustomEvent;

  if (event.detail.languageCatcherExist) {
    extensionExist.value = true;
    /*  console.log('extensionExist.value', extensionExist.value); */
  } else {
    extensionExist.value = false;
  }
});

window.addEventListener('languageCatcherResult', async (e) => {
  loadingButton.value = false;
  console.log('Result from extension', e);
  const event = e as CustomEvent;
  const language = event.detail.language;
  const resultArray: extensionResponse[] = event.detail;
  try {
    for (let index = 0; index < resultArray.length; index++) {
      const element = resultArray[index];
      console.log('element', element);
      const response = await axios.post('http://localhost:5000/api/addLanguage', {
        email: user.value,
        languageData: element
      });

      if (index === resultArray.length - 1) {
        const languagesResponse = await axios.get('http://localhost:5000/api/getUserLanguages', {
          params: { email: response.data.user.email }
        });
        console.log("language response", languagesResponse.data);

        returnedValues.value = languagesResponse.data;
        console.log('abi gitti artık ', response.data);
      }
    }

   /*  const languagesResponse = await axios.get('http://localhost:5000/api/getUserLanguages', {
      params: { email: user.value }
    });
    console.log('languagesResponse', languagesResponse.data);
    returnedValues.value = languagesResponse.data; */
  } catch (error) {
    console.log(error);
  }

  /*   returnedValues.value.push(event.detail); */
 /*  console.log(language);
  console.log('array : ', returnedValues.value); */
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

    returnedValues.value = languagesResponse.data;

    console.log('languagesss', languagesResponse.data);
    console.log('email ', response.data.user.email);
    user.value = response.data.user.email;

    appReady.value = true;
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
  <div v-if="appReady">
    <div class="topBar m-a flex w-full items-center justify-between px-8 py-6">
      <div class="cursor-pointer text-[#888AD3] hover:text-[#C0C5E5]">{{ user }}</div>

      <div class="mr-3 cursor-pointer text-[#888AD3] hover:text-[#C0C5E5]" @click="logout">
        Çıkış Yap
      </div>
    </div>
    <div class="m-a mt-5 w-4/5">
      <div class="m-a relative mt-8 inline-block flex w-[600px] items-center justify-center">
        <div v-if="extensionExist === true" class="w-full">
          <input
            type="text"
            v-model="url"
            :placeholder="extensionExist ? 'URL giriniz' : 'Eklentiniz aktif değil'"
            :disabled="extensionExist ? false : true"
            class="bg-#F2F2F2 border-b-coolGray w-full rounded-3xl p-4 focus:border-none  focus:outline-[#DCE2EE]"
          />
          <button
            class="absolute right-0 rounded-r-3xl bg-[#0059F7] p-4 text-white transition duration-300 ease-in-out hover:bg-[#3E83F7] p-2 "
            @click="sendUrlToExtension()"
          >
            Search
          </button>
        </div>
        <div v-else>
          <div class="notExistAlert text-red   p-5  rounded-md text-xl">Eklenti aktif değil !!!</div>

        </div>
      </div>

      <div class="mb-5 mt-10">
        <div class="cols-5 font-600 grid rounded-md border border-gray-300">
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
          <div class="h-full w-full rounded-md border border-gray-300 p-4 text-[#273464]">
            <div>DATE</div>
          </div>
        </div>
        <div class="max-h-500px w-full overflow-y-auto">
          <div v-for="(value, index) in returnedValues" :key="index">
            <UrlCard
              :email="user"
              :url="value.domain"
              :detected-language="value.language"
              :detected-places="value.languageFetchedFrom"
              :language-location="value.languageLocation"
              :lang-name="value.langName"
              :lang-native-name="value.langNativeName"
              :accuracy="value.languageAccuracy"
              :id="value._id"
              :real-lang-values="value.realLangValues"
              :date="value.date"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="fixed left-0 top-0 flex h-full w-full items-center justify-center">
    <v-progress-circular :size="150" color="primary" indeterminate></v-progress-circular>
  </div>
  <LoadingBarCard  :loadingButton="loadingButton" />
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

.notExistAlert {
  border-color: red !important;
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
