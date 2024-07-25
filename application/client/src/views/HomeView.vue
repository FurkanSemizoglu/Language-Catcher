<script setup lang="ts">
import axios from 'axios';
import { onMounted, ref } from 'vue';
import Buttonn from 'primevue/button';
const token = ref<string | null>('');
const user = ref<string | null>('');

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup'; // optional
import Row from 'primevue/row'; // optional

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faAngleDown, faT } from '@fortawesome/free-solid-svg-icons';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';


const url = ref<string>('');
import { useToast } from 'vue-toastification';
import UrlCard from '../components/UrlCard.vue';

const toast = useToast();
let loadingButton = ref<boolean>(false);
token.value = localStorage.getItem('token');

interface LanguageLocation {
  locacalStorage: boolean;
  sessionnStorage: boolean;
  metaTag: boolean;
  htmlTag: boolean;
  url: boolean;
  paragraph: boolean;
}

interface extensionResult {
  status: string;
  domain: string;
  language: string;
  languageFetchedFrom: string[];
  languageLocation: LanguageLocation;
  languageAccuracy: string;
}

const returnedValues = ref<extensionResult[]>([]);

const products = ref<
  Array<{ url: string; language: string; detectedPlaces: string; accuracy: number }>
>([]);
products.value = [
  { url: 'P001', language: 'en', detectedPlaces: 'Category 1', accuracy: 10 },
  { url: 'P002', language: 'Product 2', detectedPlaces: 'Category 2', accuracy: 20 },
  { url: 'P003', language: 'Product 3', detectedPlaces: 'Category 1', accuracy: 30 },
  { url: 'P004', language: 'Product 4', detectedPlaces: 'Category 3', accuracy: 40 },
  { url: 'P004', language: 'Product 4', detectedPlaces: 'Category 3', accuracy: 40 },
  { url: 'P004', language: 'Product 4', detectedPlaces: 'Category 3', accuracy: 40 },
  { url: 'P004', language: 'Product 4', detectedPlaces: 'Category 3', accuracy: 40 },
  { url: 'P004', language: 'Product 4', detectedPlaces: 'Category 3', accuracy: 40 },
  { url: 'P004', language: 'Product 4', detectedPlaces: 'Category 3', accuracy: 40 },
  { url: 'P004', language: 'Product 4', detectedPlaces: 'Category 3', accuracy: 40 },
  { url: 'P004', language: 'Product 4', detectedPlaces: 'Category 3', accuracy: 40 },
  { url: 'P004', language: 'Product 4', detectedPlaces: 'Category 3', accuracy: 40 }
];

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

const columns = [
  { field: 'code', header: 'Code' },
  { field: 'name', header: 'Name' },
  { field: 'category', header: 'Category' },
  { field: 'quantity', header: 'Quantity' }
];

const showDetails = ref<boolean>(false);

const toggleDetails = () => {
  showDetails.value = !showDetails.value;
  console.log(showDetails.value);
};
</script>

<template>
  <div>
    <div class="topBar m-a flex w-full items-center justify-between px-8 py-6">
      <div>{{ user }}</div>
      <div class="mr-3 flex items-center">
        <!--   <input
          type="text"
          v-model="url"
          placeholder="URL"
          class="border-1 w-[400px] rounded-md border p-2"
        /> -->
        <!--   <Button
          type="button"
          label="Search"
          icon="pi pi-search"
          :loading="loadingButton"
          @click="sendUrlToExtension"
          severity="secondary"
          class="bg-[#2C39A6] text-white"
          button.primary.color="blue"
        /> -->
      </div>
      <div>Çıkış Yap</div>
    </div>
    <div class="m-a mt-5 w-4/5">
      <div class="m-a relative mt-8 inline-block flex w-[600px] items-center justify-center">
        <input
          type="text"
          v-model="url"
          placeholder="Dil algılamak için url giriniz..."
          class="bg-#F2F2F2 border-b-coolGray w-full rounded-3xl p-4 focus:border-none"
        />
        <button
          class="absolute right-0 rounded-r-3xl bg-[#0059F7] p-4 text-white"
          @click="sendUrlToExtension"
        >
          Search
        </button>
      </div>

      <!--  <div class="col-3">
        <input class="effect-9 p-4 bg-#F2F2F2 w-full  p-4" type="text" placeholder="Placeholder Text" />
        <span class="focus-border">
          <i></i>
        </span>
      </div> -->

      <div class="mt-25">
        <div class="cols-3 font-600 grid rounded-md border border-gray-300">
          <div class="h-full w-full rounded-md border border-gray-300 p-4">URL</div>
          <div class="h-full w-full rounded-md border border-gray-300 p-4">LANGUAGE</div>
          <div class="h-full w-full rounded-md border border-gray-300 p-4">
            <div>DETECTED PLACES</div>
          </div>
        </div>

        <div v-for="(value, index) in returnedValues">
          <UrlCard :url="value.domain" :detected-language="value.language" :detected-places="value.languageFetchedFrom"/>
        <!--   <div class="cols-3 mt-3 grid rounded-md border border-gray-300">
            <div class="h-full p-4">{{value.domain}}</div>
            <div class="h-full w-full p-4">en-Englısh</div>
            <div class="flex h-full w-full items-center justify-between p-4">
              <div>lang url</div>
              <div>
                <FontAwesomeIcon
                  :icon="faTrashCan"
                  class="mr-4 transform cursor-pointer transition-transform duration-300"
                  :class="{ hidden: !showDetails }"
                  color="red"
                />

                <FontAwesomeIcon
                  :icon="faAngleDown"
                  class="mr-2 transform cursor-pointer transition-transform duration-300"
                  :class="{ 'rotate-0': showDetails, 'rotate-90': !showDetails }"
                  @click="toggleDetails()"
                />
              </div>
            </div>
            <transition name="detailTransition">
              <div v-if="showDetails" class="col-span-3">uzun açıklama</div>
            </transition>
          </div> -->
        </div>

        <!--  <div class="cols-3 mt-3 grid rounded-md border border-gray-300">
          <div class="h-full p-4">https://panel.efilli.com/login</div>
          <div class="h-full w-full p-4">en-Englısh</div>
          <div class="h-full w-full p-4">lang url</div>
        </div> -->
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

/* :focus {
  outline: none;
}

.col-3 {
  float: left;
  width: 27.33%;
  margin: 40px 3%;
  position: relative;
}  */ /* necessary to give position: relative to parent. */

/* .effect-9 ~ .focus-border:before,
.effect-9 ~ .focus-border:after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 0;
  height: 2px;
  background-color: #373BA6;
  transition: 0.2s;
  transition-delay: 0.2s;
}
.effect-9 ~ .focus-border:after {
  top: auto;
  bottom: 0;
  right: auto;
  left: 0;
  transition-delay: 0.6s;
}
.effect-9 ~ .focus-border i:before,
.effect-9 ~ .focus-border i:after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 2px;
  height: 0;
  background-color: #373BA6;
  transition: 0.2s;
}
.effect-9 ~ .focus-border i:after {
  left: auto;
  right: 0;
  top: auto;
  bottom: 0;
  transition-delay: 0.4s;
}
.effect-9:focus ~ .focus-border:before,
.effect-9:focus ~ .focus-border:after {
  width: 100%;
  transition: 0.2s;
  transition-delay: 0.6s;
}
.effect-9:focus ~ .focus-border:after {
  transition-delay: 0.2s;
}
.effect-9:focus ~ .focus-border i:before,
.effect-9:focus ~ .focus-border i:after {
  height: 100%;
  transition: 0.2s;
}
.effect-9:focus ~ .focus-border i:after {
  transition-delay: 0.4s;
} */
</style>
