<script setup lang="ts">
import { ref } from 'vue';


const showUrl = ref<boolean>(false);
const showLanguage = ref<boolean>(false);
const URL = ref<string>('');
let language = ref<string>('');
let detectedPlaces = ref<string[]>([]);
const showUrlButtonClicked = ()=>{
  showUrl.value = !showUrl.value;
}

const showLanguageButtonClicked = ()=>{
  showLanguage.value = !showLanguage.value;

  chrome.runtime.sendMessage({message : "show-language-in-same-page"} , (response :  any) => {
    alert(response.findedPlaces);

    language.value = response.language;
    detectedPlaces.value = response.findedPlaces;
    console.log("message sent to background for show language in same page");
    console.log("response from background  : " , response);
  
  })
}


const searchButtonClicked = () => {
  console.log('search button clicked');
  console.log(URL.value);

   chrome.runtime.sendMessage({message: 'URL-sended', url: URL.value} , (response) => {
    console.log("message sent to background");
    console.log("response from background  : " , response);
  });   
}
console.log(showUrl.value);

</script>

<template>
  <div class="min-w-md max-w-md flex flex-col items-center py-2 gap-1 ">
    <div v-if="showUrl" class="flex ">
      <input v-model="URL" class="w-270px p-2" type="text" placeholder="Type a url to detect the language"/>
      <button @click="searchButtonClicked">Search</button>
    </div>

    <div class="flex gap-1">
      <button class="p-2 bg-#0059f7 border rounded-lg text-white text-xl cursor-pointer shadow-xl" @click="showLanguageButtonClicked">Show The Language</button>

      <button  class="p-2 bg-#0059f7 border rounded-lg text-white text-xl cursor-pointer" @click="showUrlButtonClicked" >Or Write An Url</button>
    </div>

    <div v-if="showLanguage">
      <span>{{ language }}</span>
      <div>
        Veriler buralardan alınmıştır : 
        <span v-for="place in detectedPlaces" :key="place">{{ place }} ,</span>
      </div>
    </div>
  </div>
</template>
