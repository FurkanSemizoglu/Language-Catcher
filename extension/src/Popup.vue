<script setup lang="ts">
import axios from 'axios'
import { onMounted, ref, watch } from 'vue'

/* import { faAngleDown, faTrashCan, faSliders, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faSquareCheck, faSquare } from '@fortawesome/free-regular-svg-icons'; */

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import { faSquareCheck } from '@fortawesome/free-regular-svg-icons'
import { faSquare } from '@fortawesome/free-regular-svg-icons'
import { faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { faSliders } from '@fortawesome/free-solid-svg-icons/faSliders'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons/faMagnifyingGlass'
import { useToast } from 'vue-toastification'

import UrlCard from './components/UrlCard.vue'
import LoadingBarCard from './components/LoadingBarCard.vue'

import type { extensionResult, ExtensionResponse as extensionResponse } from './types'

const checkbox = ref<boolean>(false)
const token = ref<string | null>('')
const user = ref<string>('')
const url = ref<string>('')
const loadingButton = ref<boolean>(false)
let extensionExist = ref<boolean>(true)
const appReady = ref<boolean>(false)
const dateClicked = ref<boolean>(true)
const urlClicked = ref<boolean>(false)
const toast = useToast()
token.value = localStorage.getItem('token')

const returnedValues = ref<extensionResult[]>([])
const tempReturnedValues = ref<extensionResult[]>([])
const allItemsSelected = ref<boolean>(false)
const deleteItemsList = ref<string[]>([])

/* const startTable = new CustomEvent('startTable', {
 
  detail: {
    start: true
  }
})

console.log("dispatcehd event");

window.dispatchEvent(startTable) */

extensionExist.value = true
// Burada hep dinleyebiliriz ya da sadece bi kere de dinlenebilir
window.addEventListener('language-catcher-exist', (e) => {
  const event = e as CustomEvent

  if (event.detail.languageCatcherExist) {
    extensionExist.value = true
    console.log('extensionExist.value', extensionExist.value)
  } else {
    extensionExist.value = false
  }
})

window.addEventListener('languageCatcherResult', async (e) => {
  console.log('Result from extension', e)
  const event = e as CustomEvent
  const language = event.detail.language
  const resultArray: extensionResponse[] = event.detail
  try {
    for (let index = 0; index < resultArray.length; index++) {
      const element = resultArray[index]
      console.log('element', element)
      const response = await axios.post('http://localhost:5000/api/addLanguage', {
        email: user.value,
        languageData: element
      })

      if (index === resultArray.length - 1) {
        const languagesResponse = await axios.get('http://localhost:5000/api/getUserLanguages', {
          params: { email: response.data.user.email }
        })
        console.log('language response', languagesResponse.data)

        returnedValues.value = languagesResponse.data
        tempReturnedValues.value = languagesResponse.data
        loadingButton.value = false

        console.log('sorted languages', languagesResponse.data)
      }
    }
  } catch (error) {
    console.log(error)
  }

  url.value = ''
})

onMounted(async () => {
  console.log('token', token.value)

  try {
    /*  const response = await axios.post('http://localhost:5000/auth/user', {
      token: token.value
    }); */

    /*  console.log(response.data);
    user.value = response.data.user.email; */
    user.value = 'furkan@gmail.com'
    const languagesResponse = await axios.get('http://localhost:5000/api/getUserLanguages', {
      params: { email: 'furkan@gmail.com' }
    })

    returnedValues.value = languagesResponse.data
    tempReturnedValues.value = languagesResponse.data
    console.log('languagesss', languagesResponse.data)
    /*  console.log('email ', response.data.user.email);
    user.value = response.data.user.email; */

    appReady.value = true
  } catch (error) {
    console.log(error)
  }
})

const sendUrlToExtension = () => {
  console.log(url.value)
  loadingButton.value = true

  if (url.value === '' || !url.value.includes('http')) {
    loadingButton.value = false
    toast.error('Url geçerli değil')
    console.log('url geçerli değil')
    return
  }
  const sendedURL = new CustomEvent('language-catcher-start', {
    detail: {
      status: 'OK',
      url: url.value
    }
  })

  chrome.runtime.sendMessage(
    {
      action: 'language-catcher-start',
      url: url.value
    },
    async (response) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message)
      } else {
        console.log('Response received:', response)

        const resultArray: extensionResponse[] = response
        console.log("result array", resultArray);
        try {
          for (let index = 0; index < resultArray.length; index++) {
            const element = resultArray[index]
            console.log('element', element)
            const response = await axios.post('http://localhost:5000/api/addLanguage', {
              email: user.value,
              languageData: element
            })

            if (index === resultArray.length - 1) {
              const languagesResponse = await axios.get(
                'http://localhost:5000/api/getUserLanguages',
                {
                  params: { email: response.data.user.email }
                }
              )
              console.log('language response', languagesResponse.data)

              returnedValues.value = languagesResponse.data
              tempReturnedValues.value = languagesResponse.data
              loadingButton.value = false

              console.log('sorted languages', languagesResponse.data)
            }
          }
        } catch (error) {
          console.log(error)
        }

        url.value = ''
      }
    }
  )
  console.log('event dispatched')
  window.dispatchEvent(sendedURL)
  console.log('event dispatched 2')
}

const logout = async () => {
  const response = await axios.get('http://localhost:5000/auth/logout')

  localStorage.removeItem('token')
  window.location.href = '/'
}

const sortDate = () => {
  if (dateClicked.value === false) {
    returnedValues.value.sort((a: extensionResult, b: extensionResult) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime()
    })
    dateClicked.value = true
  } else {
    returnedValues.value.sort((a: extensionResult, b: extensionResult) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
    dateClicked.value = false
  }
  returnedValues.value = [...returnedValues.value]
  console.log('sorted values', returnedValues.value)
}

const sortUrls = () => {
  if (urlClicked.value === false) {
    returnedValues.value.sort((a: extensionResult, b: extensionResult) => {
      console.log('splittedd ', a.domain.split('/'))
      const aValue = a.domain.split('/')[2]
      const bValue = b.domain.split('/')[2]

      console.log('valuesssss', aValue, bValue)
      if (aValue < bValue) {
        return -1
      }
      if (aValue > bValue) {
        return 1
      }
      return 0
    })
    urlClicked.value = true
  } else {
    returnedValues.value.sort((a: extensionResult, b: extensionResult) => {
      const aValue = a.domain.split('/')[2]
      const bValue = b.domain.split('/')[2]

      console.log('valuesssss', aValue, bValue)
      if (aValue < bValue) {
        return 1
      }
      if (aValue > bValue) {
        return -1
      }
      return 0
    })
    urlClicked.value = false
  }

  console.log('sorted names ', returnedValues.value)
}

const deleteItemsFunc = (id: string) => {
  console.log('received id ', id)
  if (deleteItemsList.value.includes(id)) {
    deleteItemsList.value = deleteItemsList.value.filter((item) => item !== id)
    console.log(deleteItemsList.value)
    return
  }
  deleteItemsList.value.push(id)
  console.log('delete items', deleteItemsList.value)
}

const deleteItems = async () => {
  if (deleteItemsList.value.length === 0) {
    appReady.value = true
    return
  }
  appReady.value = false
  console.log('ReturnedValues.value', returnedValues.value)
  console.log('tempReturnedValues.value', tempReturnedValues.value)

  console.log('delete items clicked  ', deleteItemsList.value)
  console.log('user ', user.value)
  try {
    const response = await axios.delete('http://localhost:5000/api/deletesLanguages', {
      params: { email: user.value, languageIdList: deleteItemsList.value }
    })

    console.log('abi gitti artık ', response.data)

    returnedValues.value = response.data
    tempReturnedValues.value = response.data
    console.log('returned values', returnedValues.value)
    console.log('after delete items list ', deleteItemsList.value)
    appReady.value = true
    allItemsSelected.value = false
    deleteItemsList.value = []
  } catch (error) {
    console.log(error)
  }
}

/* const extensionId = 'bkoahppiepfhhkofbhlagafcbklmdedi'
const messageBody = 'exist'
if (chrome?.runtime?.sendMessage) {
  chrome.runtime.sendMessage(extensionId, messageBody, function (response) {
    console.log('The extension IS installed.', response)
  })
} else {
  console.log('The extension is NOT installed.')
} */

const openFilter = ref<boolean>(false)
const searchedUrl = ref<string>('')
let oldReturnedValues = ref<extensionResult[]>([])
oldReturnedValues.value = JSON.parse(JSON.stringify(returnedValues.value))

const searchUrl = () => {
  console.log('old values', oldReturnedValues.value)
  console.log('searched url', searchedUrl.value)
  const searchedValues = tempReturnedValues.value.filter((value: any) => {
    return value.domain.includes(searchedUrl.value)
  })

  returnedValues.value = searchedValues
  console.log('searched values', searchedValues)
}

if (searchedUrl.value === '') {
  returnedValues.value = oldReturnedValues.value
}

const highAccuracy = ref<boolean>(false)
const mediumAccuracy = ref<boolean>(false)
const lowAccuracy = ref<boolean>(false)

const filterAccuracy = () => {
  if (!highAccuracy.value && !mediumAccuracy.value && !lowAccuracy.value) {
    returnedValues.value = tempReturnedValues.value
    return
  }
  console.log('hifh ', highAccuracy.value)

  /*  let flag : boolean = false */
  returnedValues.value = tempReturnedValues.value.filter((value: any) => {
    if (highAccuracy.value && value.languageAccuracy === 'high') return true
    if (mediumAccuracy.value && value.languageAccuracy === 'medium') return true
    if (lowAccuracy.value && value.languageAccuracy === 'low') return true
    /* 
    if(flag) return true; */
    return false
  })

  console.log('returned values', returnedValues.value)
}

watch([highAccuracy, mediumAccuracy, lowAccuracy], filterAccuracy)
watch(searchedUrl, searchUrl)
</script>

<template>
  <div id="popup" class="h-full w-full">
    <div class="m-a w-full h-full">
      <div class="m-a relative inline-block flex max-w-[600px] items-center justify-center">
        <div v-if="extensionExist" class="w-full">
          <input
            type="text"
            v-model="url"
            :placeholder="extensionExist ? 'URL giriniz' : 'Eklentiniz aktif değil'"
            :disabled="extensionExist ? false : true"
            class="bg-#FCFCFC border-b-coolGray w-full rounded-3xl border p-4 focus:border-none focus:outline-[#DCE2EE]"
          />
          <button
            class="absolute right-0 h-full rounded-r-3xl bg-[#2F33B0] p-4 text-white transition duration-300 ease-in-out hover:bg-[#3E83F7]"
            @click="sendUrlToExtension()"
          >
            Search
          </button>
        </div>
        <div v-else>
          <div class="notExistAlert text-red ma rounded-md p-5 text-xl">
            Eklenti aktif değil !!!
          </div>
        </div>
      </div>

      <div class="mx-a w-[100%] mt-5 rounded-lg lg:w-[100%]">
        <div class="filters">
          <div class="mb-2 flex w-full items-center justify-end">
            <div class="flex items-center">
              <div class="mr-2 rounded-lg border">
                <input type="text" class="w-full rounded-lg px-1 py-0.5" v-model="searchedUrl" />
              </div>
              <FontAwesomeIcon
                :icon="faMagnifyingGlass"
                class="mr-4 transform cursor-pointer transition-transform duration-300"
                @click="searchUrl()"
              />
            </div>
            <div class="relative">
              <FontAwesomeIcon
                :icon="faSliders"
                class="tooltipSearch mr-4 transform cursor-pointer transition-transform duration-300"
                @click="openFilter = !openFilter"
              />

              <div
                v-if="openFilter"
                class="-top-25 -left-30 absolute rounded-lg border-[#2F33B0] p-4 shadow-lg"
              >
                <div class="mb-5 flex items-center justify-center">Accuracy Filter</div>
                <div class="flex items-center gap-2">
                  <input type="checkbox" v-model="highAccuracy" class="mr-1" />
                  <label>High</label>

                  <input type="checkbox" v-model="mediumAccuracy" class="mr-1" />
                  <label>Medium</label>

                  <input type="checkbox" v-model="lowAccuracy" class="mr-1" />
                  <label>Low</label>
                </div>
              </div>
            </div>
            <div>
              <FontAwesomeIcon
                :icon="faTrashCan"
                class="mr-4 transform cursor-pointer transition-transform duration-300"
                @click="deleteItems()"
              />
            </div>
          </div>
        </div>
        <div class="block w-[100%] relative">
          <div class="block w-[100%] overflow-x-auto">
            <div class="min-w-800px block">
              <div
                class="cols-7 font-600 min-h-65px grid rounded-t-lg border border-gray-300 bg-[#2F33B0] text-white"
                style="grid-template-columns: 0.5fr 1.5fr 2fr 2fr 2fr 2fr 2fr"
              >
                <div class="flex h-full w-full items-center p-4">
                  <FontAwesomeIcon
                    :icon="allItemsSelected ? faSquareCheck : faSquare"
                    class="cursor-pointer text-white"
                    @click="allItemsSelected = !allItemsSelected"
                  />
                </div>
                <div class="col-span-0 flex h-full cursor-pointer items-center justify-around p-4">
                  <div class="">ORDER</div>
                </div>
                <div class="flex h-full w-full items-center p-4 hover:font-bold">URL</div>
                <div class="flex h-full w-full items-center p-4">LANGUAGE</div>
                <div class="flex h-full w-full items-center p-4">
                  <div>DETECTED PLACES</div>
                </div>
                <div class="flex h-full w-full items-center p-4">
                  <div>ACCURACY</div>
                </div>
                <div
                  class="flex h-full w-full cursor-pointer items-center justify-between p-4 hover:font-bold"
                  @click="sortDate()"
                >
                  <div>DATE</div>
                  <div>
                    <FontAwesomeIcon
                      :icon="faAngleDown"
                      class="mr-2 transform cursor-pointer transition-transform duration-300"
                      :class="{ 'rotate-0': dateClicked, 'rotate-180': !dateClicked }"
                    />
                  </div>
                </div>
              </div>
              <div class="">
                <div v-if="appReady" class="w-full overflow-y-auto">
                  <!--  max-h-500px -->
                  <div v-for="(value, index) in returnedValues" :key="value._id">
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
                      :date="new Date(value.date)"
                      :index="index"
                      :allItemsSelected="allItemsSelected"
                      @cardId="deleteItemsFunc"
                    />
                  </div>
                </div>
                <div
                  v-else
                  class="ma top-50 absolute z-50 flex h-full w-full items-center justify-center"
                >
                  <v-progress-circular
                    :size="150"
                    color="primary"
                    indeterminate
                  ></v-progress-circular>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- </div> -->
    </div>
  </div>

  <LoadingBarCard :loadingButton="loadingButton" />
</template>

<style scoped>
.tooltipSearch {
  position: relative;
  display: inline-block;
}

.tooltipSearch:hover::after {
  content: 'Email ve şifrenizi giriniz';
  position: absolute;
  background-color: #888ad3;
  color: white;
  padding: 5px;
  border-radius: 4px;
  font-size: 14px;
  top: 0;
  z-index: 100;
  margin-bottom: 5px;
  transform: translateX(-50%);
  white-space: nowrap;
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
