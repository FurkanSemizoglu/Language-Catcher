<script setup lang="ts">
import { ref  , onMounted} from 'vue'

/* const showUrl = ref<boolean>(false)
const showLanguage = ref<boolean>(false)
const URL = ref<string>('') */
let language = ref<string>('')
let detectedPlaces = ref<string[]>([])
let paragraphExist = ref<boolean>(false)
let langName = ref<string>('')
let langNativeName = ref<string>('')
import {languages} from './types'



/* const showUrlButtonClicked = () => {
  showUrl.value = !showUrl.value
} */

window.addEventListener('language-catcher-start', (e) => {
  console.log('Language catcher is starting')
  const event = e as CustomEvent
  const domain = event.detail.domain
  console.log(domain)
})

onMounted(() => {

  chrome.runtime.sendMessage({ message: 'show-language-in-same-page' }, (response: any) => {
    language.value = response.language
    detectedPlaces.value = response.findedPlaces
    paragraphExist.value = response.paragraphLang

    langName.value = languages[response.language].name
    langNativeName.value = languages[response.language].nativeName
    console.log('message sent to background for show language in same page')
    console.log('response from background  : ', response)
  })
})

/* const showLanguageButtonClicked = () => {
  showLanguage.value = !showLanguage.value

  if (showLanguage.value === true) {
    chrome.runtime.sendMessage({ message: 'show-language-in-same-page' }, (response: any) => {
      language.value = response.language
      detectedPlaces.value = response.findedPlaces
      paragraphExist.value = response.paragraphLang

      langName.value = languages[response.language].name
      langNativeName.value = languages[response.language].nativeName
      console.log('message sent to background for show language in same page')
      console.log('response from background  : ', response)
    })
  }
} */

/* const searchButtonClicked = () => {
  console.log(URL.value)

  showLanguage.value = true

  chrome.runtime.sendMessage({ message: 'URL-sended', url: URL.value }, (response: any) => {
    language.value = response.language
    detectedPlaces.value = response.findedPlaces
    paragraphExist.value = response.paragraphLang

    langName.value = languages[response.language].name
    langNativeName.value = languages[response.language].nativeName
    console.log('message sent to background for show language in same page')
    console.log('response from background  : ', response)
  })
} */
</script>

<template>
  <div class="min-w-md max-w-md flex flex-col items-center py-2 gap-1">
    <!--   <div v-if="showUrl" class="flex">
      <input
        v-model="URL"
        class="w-270px p-2"
        type="text"
        placeholder="Type a url to detect the language"
      />
      <button @click="searchButtonClicked">Search</button>
    </div> -->

    <!--    <div class="flex gap-1">
      <button
        class="p-2 bg-#0059f7 border rounded-lg text-white text-xl cursor-pointer shadow-xl"
        @click="showLanguageButtonClicked"
      >
        Show The Language
      </button>

      <button
        class="p-2 bg-#0059f7 border rounded-lg text-white text-xl cursor-pointer"
        @click="showUrlButtonClicked"
      >
        Or Write An Url
      </button>
    </div> -->

    <div class="flex flex-col w-s mx-a max-w-s px-12">
      <div class="">
        <span class="font-bold text-xl text-[#2F33B0]">Language : </span>
        <span v-if="language !== 'not detected'" class="text-lg"
          >{{ language }} - {{ langName }} - {{ langNativeName }}</span
        >
        <span v-else class="text-lg">Not Detected</span>
      </div>
      <br />
      <div v-if="language !== 'not detected'" class="text-lg ">
        <div>
          <span class="font-bold text-xl text-[#2F33B0]">Description : </span>
          <span>Veriler buralardan alınmıştır:</span>
          <br />
          <span v-for="place in detectedPlaces" :key="place"
            >{{ place }} <span v-if="place !== detectedPlaces[detectedPlaces.length - 1]">-</span>
          </span>
          .
        </div>
        <span v-if="paragraphExist && detectedPlaces.length > 0">
          Ayrıca sitenin içeriğinin de
          <span v-if="detectedPlaces.includes('lang etiketi')">lang etiketi </span>
          <span v-else>url </span>
          ile uyuştuğu tespit edilmiştir
        </span>
      </div>
      <div v-else class="text-lg">
        <div>
          <span class="font-bold text-xl">Description : </span>
          <br />
          Kullanıcıdan ekstra veri alınız .
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>

body{
    font-family: 'Lexend', sans-serif;
}
</style>