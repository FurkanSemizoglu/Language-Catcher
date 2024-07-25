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

const toast = useToast();
let loadingButton = ref<boolean>(false);
token.value = localStorage.getItem('token');

const returnedValues = ref<string[]>([]);

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
    <div class="topBar m-a flex w-4/5 items-center justify-between px-4 py-6">
      <div>{{ user }}</div>
      <div class="mr-3 flex items-center">
        <input
          type="text"
          v-model="url"
          placeholder="URL"
          class="border-1 w-[400px] rounded-md border p-2"
        />
        <Button
          type="button"
          label="Search"
          icon="pi pi-search"
          :loading="loadingButton"
          @click="sendUrlToExtension"
          severity="secondary"
          class="bg-[#2C39A6] text-white"
          button.primary.color="blue"
        />
      </div>
      <div>Çıkış Yap</div>
    </div>
    <div class="m-a mt-5 w-4/5">
      <!--       <table class="w-full">
        <tr>
          <th>URL</th>
          <th>LANGUAGE</th>
          <th>DETECTED PlACES</th>
        </tr>
        <tr class="">
          <td>Alfreds Futterkiste</td>
          <td>Maria Anders</td>
          <td>Germany</td>
        </tr>
        <tr>
          <td>Centro comercial Moctezuma</td>
          <td>Francisco Chang</td>
          <td>Mexico</td>
        </tr>
        <tr>
          <td>Ernst Handel</td>
          <td>Roland Mendel</td>
          <td>Austria</td>
        </tr>
        <tr>
          <td>Island Trading</td>
          <td>Helen Bennett</td>
          <td>UK</td>
        </tr>
        <tr>
          <td>Laughing Bacchus Winecellars</td>
          <td>Yoshi Tannamuri</td>
          <td>Canada</td>
        </tr>
        <tr>
          <td>Magazzini Alimentari Riuniti</td>
          <td>Giovanni Rovelli</td>
          <td>Italy</td>
        </tr>
      </table> -->
      <!-- 
      <div class="bg-#F2F2F2 cols-2 grid w-full">
        <div class="cols-3 grid" @click="toggleDetails()">
          <div>url</div>
          <div>language</div>
          <div>detectedPlaces</div>
          <transition name="detailTransition">
            <div v-if="showDetails" class="col-span-3">uzun açıklama</div>
          </transition>
        </div>
        <div class="cols-3 grid">
          <div>url</div>
          <div>language</div>
          <div>detectedPlaces</div>
        </div>
      </div>
 -->

      <div class="mt-25">
        <div class="cols-3 font-600 grid rounded-md border border-gray-300">
          <div class="h-full w-full rounded-md border border-gray-300 p-4">URL</div>
          <div class="h-full w-full rounded-md border border-gray-300 p-4">LANGUAGE</div>
          <div class="h-full w-full rounded-md border border-gray-300 p-4">
            <div>DETECTED PLACES</div>
          </div>
          <!--    <transition name="detailTransition">
            <div v-if="showDetails" class="col-span-3">uzun açıklama</div>
          </transition> -->
        </div>

        <div class="cols-3 mt-3 grid rounded-md border border-gray-300"">
          <div class="h-full p-4">https://panel.efilli.com/login</div>
          <div class="h-full w-full p-4">en-Englısh</div>
          <div class="flex h-full w-full items-center justify-between p-4">
            <div>lang url</div>
            <div>
              <FontAwesomeIcon
                :icon="faTrashCan"
                class="mr-3 transform cursor-pointer transition-transform duration-300"
                :class="{ hidden: !showDetails }"
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
        </div>

        <div class="cols-3 mt-3 grid rounded-md border border-gray-300">
          <div class="h-full p-4">https://panel.efilli.com/login</div>
          <div class="h-full w-full p-4">en-Englısh</div>
          <div class="h-full w-full p-4">lang url</div>
          <!--   <transition name="detailTransition">
            <div v-if="showDetails" class="col-span-3">uzun açıklama</div>
          </transition> -->
        </div>
      </div>

      <!--  <v-data-table :items="products" class="text-red"></v-data-table> -->
      <!--   <v-data-table-virtual
        :headers="columns"
        :items="products"
        height="400"
        item-value="name"
      ></v-data-table-virtual> -->
      <!--  <DataTable :value="products" class="w-full ">
        <Column
          v-for="col of columns"
          :key="col.field"
          :field="col.field"
          :header="col.header"
          class="w-1/4"
        ></Column>
      </DataTable> -->
    </div>
  </div>
</template>

<style scoped>
.topBar {
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

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
