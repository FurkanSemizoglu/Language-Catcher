<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

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

let token = ref<string | null>('')
const user = ref<string>('')
const url = ref<string>('')
const loadingButton = ref<boolean>(false)
let extensionExist = ref<boolean>(true)
const appReady = ref<boolean>(false)
const dateClicked = ref<boolean>(true)
const toast = useToast()
token.value = localStorage.getItem('token')

const returnedValues = ref<extensionResult[]>([])
const tempReturnedValues = ref<extensionResult[]>([])
const allItemsSelected = ref<boolean>(false)
const deleteItemsList = ref<string[]>([])

const userExist = ref<boolean>(false)
const loginPage = ref<boolean>(false)

const updateProgressNumber = ref<number>(0)

chrome.runtime.onMessage.addListener((request) => {
  console.log('request', request)
  if (request.message === 'updateProgress') {
    console.log('proges in popup', request.progress)
    updateProgressNumber.value = request.progress
    if (updateProgressNumber.value === 1) {
      setTimeout(() => {
        updateProgressNumber.value = 0
      }, 1000)
    }
  }
})

watch(
  () => updateProgressNumber.value,
  (newValue) => {
    updateProgressNumber.value = newValue as number
  }
)

extensionExist.value = true

const getTableDatas = async (tokenn: string) => {
  return new Promise((resolve, reject) => {
    try {
      let existValues: any = []
      chrome.runtime.sendMessage({ message: 'getReturnedValues' }, (response) => {
        const storedValues = response
        existValues = existValues.concat(storedValues)
      })
      token.value = tokenn
      chrome.runtime.sendMessage(
        {
          message: 'getUser',
          token: tokenn
        },
        (response) => {
          user.value = response.user.email

          if (response) {
            if (
              existValues &&
              existValues?.length > 0 &&
              existValues !== null &&
              existValues[0] !== 'undefined'
            ) {
              const parsedValues = JSON.parse(existValues)
              for (let index = 0; index < parsedValues.length; index++) {
                const addDataLanguage: extensionResponse = {
                  status: parsedValues[index].status,
                  domain: parsedValues[index].domain,
                  language: parsedValues[index].language,
                  languageFetchedFrom: parsedValues[index].languageFetchedFrom,
                  langName: parsedValues[index].langName,

                  langNativeName: parsedValues[index].langNativeName,
                  languageLocation: parsedValues[index].languageLocation,
                  languageAccuracy: parsedValues[index].languageAccuracy,
                  realValues: parsedValues[index].realLangValues,
                  date: parsedValues[index].date
                }

                chrome.runtime.sendMessage(
                  {
                    message: 'addLanguage',
                    email: user.value,
                    languageData: addDataLanguage
                  },
                  () => {
                    if (index === parsedValues.length - 1) {
                      chrome.runtime.sendMessage(
                        {
                          message: 'getUserLanguages',
                          email: user.value
                        },
                        (response) => {
                          returnedValues.value = response
                          tempReturnedValues.value = response
                          loadingButton.value = false
                          url.value = ''
                        }
                      )
                    }
                  }
                )
              }

              chrome.runtime.sendMessage({ message: 'deleteReturnedValues' })
            } else {
              userExist.value = true
              user.value = response.user.email

              chrome.runtime.sendMessage(
                {
                  message: 'getUserLanguages',
                  email: user.value
                },
                (response) => {
                  returnedValues.value = response
                  tempReturnedValues.value = response

                  appReady.value = true

                  resolve(returnedValues.value)
                }
              )
            }
          } else {
            userExist.value = false
          }
        }
      )

      appReady.value = true
    } catch (error) {
      console.log(error)
      localStorage.removeItem('token')
      window.location.href = '/'
      reject('error')
      // burada token expire olursa yapılcak işlemleri ayarla
    }
  })
}

/* const existUserhandler = async (email: string) => {
  return new Promise(async (resolve, reject) => {

    const bodyFormData = {
      email: email,
      password: 'Furkan55?'
    }

    chrome.runtime.sendMessage(
      {
        message: 'login',
        bodyFormData: bodyFormData
      },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error('Error:', chrome.runtime.lastError.message)
          return
        }
        console.log('response', response)
        localStorage.removeItem('token')
        console.log('token response ', response.token)

        localStorage.setItem('token', response.token)
        token.value = response.token

        getTableDatas(response.token).then((response) => {
          console.log('response of get table datas', response)
          resolve(token.value)
        })


      }
    )
    reject('error')
  })
} */

const tempLoading = ref<boolean>(true)

onMounted(async () => {
  setTimeout(() => {
    tempLoading.value = false
    console.log('temp load 2', tempLoading.value)
  }, 1000)

  chrome.runtime.sendMessage({ message: 'getToken' }, function (response) {
    token.value = response

    // burada exist use var mı diye bir kontrol mesajı gönderilebilir varsa localStoragedan token silinir.
    if (token.value === null && !userExist.value) {
      chrome.runtime.sendMessage({ message: 'getReturnedValues' }, (response) => {
        const storedValues = response
        if (storedValues.length === 0 || storedValues === null || storedValues === 'undefined') {
          appReady.value = true
          return
        }
        returnedValues.value = storedValues ? JSON.parse(storedValues) : []

        appReady.value = true
        return
      })
    } else if (!userExist.value && token.value !== null) {
      getTableDatas(token.value)
    }
  })
})

const sendUrlToExtension = () => {
  console.log(url.value)
  loadingButton.value = true

  if (url.value === '' || !url.value.includes('http')) {
    loadingButton.value = false
    toast.error('Url geçerli değil')
    return
  }

  chrome.runtime.sendMessage(
    {
      action: 'language-catcher-start',
      url: url.value
    },
    async (response) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message)
      } else {
        const resultArray: extensionResponse[] = response
        try {
          if (token.value === null) {
            for (let index = 0; index < resultArray.length; index++) {
              const element = resultArray[index]
              const transformedElement: extensionResult = {
                _id: 'id' + Math.random().toString(16).slice(2),
                status: element.status,
                domain: element.domain,
                language: element.language,
                languageFetchedFrom: element.languageFetchedFrom,
                langName: element.langName,
                langNativeName: element.langNativeName,
                languageLocation: element.languageLocation,
                languageAccuracy: element.languageAccuracy,
                realLangValues: element.realValues,
                date: element.date.toString(),
                belongUser: {
                  email: 'Guest',
                  _id: ''
                }
              }
              returnedValues.value.push(transformedElement)
              tempReturnedValues.value.push(transformedElement)
            }
            loadingButton.value = false
            appReady.value = true

            chrome.runtime.sendMessage(
              { message: 'storeReturnedValues', returnedValues: returnedValues.value },
              (response) => {
                console.log('response of store returned values', response)
              }
            )
            url.value = ''

            return
          } else {
            for (let index = 0; index < resultArray.length; index++) {
              const element = resultArray[index]
              chrome.runtime.sendMessage(
                {
                  message: 'addLanguage',
                  email: user.value,
                  languageData: element
                },
                () => {
                  if (index === resultArray.length - 1) {
                    chrome.runtime.sendMessage(
                      {
                        message: 'getUserLanguages',
                        email: user.value
                      },
                      (response) => {
                        returnedValues.value = response
                        tempReturnedValues.value = response
                        loadingButton.value = false
                        url.value = ''
                        return
                      }
                    )
                  }
                }
              )
            }
          }
        } catch (error) {
          console.log(error)
        }

        url.value = ''
      }
    }
  )
}

/* const logout = async () => {
  const response = await axios.get('http://localhost:5000/auth/logout')

  localStorage.removeItem('token')
  window.location.href = '/'
} */

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
}

/* const sortUrls = () => {
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
} */

const deleteItemsFunc = (id: string) => {
  if (deleteItemsList.value.includes(id)) {
    deleteItemsList.value = deleteItemsList.value.filter((item) => item !== id)
    console.log(deleteItemsList.value)
    return
  }
  deleteItemsList.value.push(id)
}

const deleteItems = async () => {
  if (deleteItemsList.value.length === 0) {
    appReady.value = true
    toast.error('Veri seçilmedi!')
    return
  } else if (token.value === null) {
    appReady.value = true

    console.log('delete list', deleteItemsList.value)
    returnedValues.value = returnedValues.value.filter((value) => {
      return !deleteItemsList.value.includes(value._id)
    })
    tempReturnedValues.value = tempReturnedValues.value.filter((value) => {
      return !deleteItemsList.value.includes(value._id)
    })

    chrome.runtime.sendMessage(
      { message: 'deleteReturnedValues', returnedValues: returnedValues.value },
      (response) => {
        if (response) {
          appReady.value = true
          allItemsSelected.value = false
          deleteItemsList.value = []
          return
        }
      }
    )
  }
  appReady.value = false
  try {
    chrome.runtime.sendMessage(
      {
        message: 'deletesLanguages',
        email: user.value,
        languageIdList: deleteItemsList.value
      },
      (response) => {
        returnedValues.value = response
        tempReturnedValues.value = response
        appReady.value = true
        allItemsSelected.value = false
        deleteItemsList.value = []
      }
    )
  } catch (error) {
    console.log(error)
  }
}

const openFilter = ref<boolean>(false)
const searchedUrl = ref<string>('')
let oldReturnedValues = ref<extensionResult[]>([])
oldReturnedValues.value = JSON.parse(JSON.stringify(returnedValues.value))

const searchUrl = () => {
  const searchedValues = tempReturnedValues.value.filter((value: any) => {
    return value.domain.includes(searchedUrl.value)
  })
  returnedValues.value = searchedValues
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

  returnedValues.value = tempReturnedValues.value.filter((value: any) => {
    if (highAccuracy.value && value.languageAccuracy === 'high') return true
    if (mediumAccuracy.value && value.languageAccuracy === 'medium') return true
    if (lowAccuracy.value && value.languageAccuracy === 'low') return true

    return false
  })
}

import AuthPage from './components/AuthPage.vue'
import ProfileComponent from './components/ProfileComponent.vue'

watch([highAccuracy, mediumAccuracy, lowAccuracy], filterAccuracy)
watch(searchedUrl, searchUrl)

const pageChecker = (isLoggedIn: boolean) => {
  if (isLoggedIn) {
    loginPage.value = false
  } else {
    loginPage.value = true
  }
}

const loginText = ref<boolean>(true)
</script>

<template>
  <div id="popup" class="h-full w-full p-2">
    <div class="m-a w-full h-full">
      <div class="m-a relative inline-block flex max-w-[600px] items-center justify-center">
        <div v-if="loginPage === true">
          <AuthPage @main-page="pageChecker" @token="getTableDatas" />
          <!--  <LoginCard /> -->
        </div>
        <div
          v-else-if="extensionExist"
          class="animate__animated animate__fadeInDown w-full flex items-center justify-between gap-2"
        >
          <input
            type="text"
            v-model="url"
            :placeholder="extensionExist ? 'URL giriniz' : 'Eklentiniz aktif değil'"
            :disabled="extensionExist ? false : true"
            class="bg-#FCFCFC border-b-coolGray w-full rounded-sm border p-4 focus:border-none focus:outline-[#DCE2EE]"
          />
          <button
            class="h-full rounded-r-sm bg-[#2F33B0] p-4 text-white transition duration-300 ease-in-out hover:bg-[#3E83F7]"
            @click="sendUrlToExtension()"
          >
            Search
          </button>
        </div>
        <div v-else-if="!extensionExist">
          <div class="notExistAlert text-red ma rounded-md p-5 text-xl">
            Eklenti aktif değil !!!
          </div>
        </div>
        <!--    <div v-else-if="!userExist">
          <div class="animate__animated animate__fadeInDown ma rounded-md p-5 text-xl">
            Url aratmak için lütfen
            <span class="text-[#2C39A6] cursor-pointer" @click="loginPage = !loginPage">giriş</span>
            yapınız.
          </div>
        </div> -->
      </div>

      <div class="mx-a w-[100%] mt-5 lg:w-[100%]">
        <div class="filters flex items-center justify-between">
          <div class="flex items-center">
            <div v-if="user">
              <ProfileComponent :user="user" />
            </div>
            <div v-else>
              <!--  <div class="animate__animated animate__fadeInDown ma rounded-md p-5 text-xl">
                Url aratmak için lütfen
                <span class="text-[#2C39A6] cursor-pointer" @click="loginPage = !loginPage">giriş</span>
                yapınız.
              </div> -->
              <div
                v-if="loginText"
                class="animate__animated animate__fadeInDown ma rounded-md px-2 text-md"
                @click="loginText = !loginText"
              >
                <span
                  class="text-[#2C39A6] cursor-pointer flex items-center w-100px"
                  @click="loginPage = !loginPage"
                  >Giriş Yap</span
                >
              </div>
              <div
                v-else
                class="animate__animated animate__fadeInDown ma rounded-md px-2 text-md"
                @click="(loginText = !loginText), (loginPage = !loginPage)"
              >
                <span class="text-[#2C39A6] cursor-pointer flex items-center w-100px"
                  >Geri Dön</span
                >
              </div>
            </div>
          </div>
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
                class="-top-25 -left-45 absolute rounded-lg border-[#2F33B0] p-4 shadow-lg flex items-center justify-between"
              >
                <div class="">
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
                <!--  <div>Show just mine urls.</div> -->
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
                class="cols-8 font-600 min-h-65px grid border border-gray-300 bg-[#2F33B0] text-white"
                style="grid-template-columns: 0.5fr 1.5fr 2fr 2fr 2fr 2fr 2fr 2fr"
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
                <div class="flex h-full w-full items-center">
                  <div>DETECTED PLACES</div>
                </div>
                <div class="flex h-full w-full items-center p-4">
                  <div>ACCURACY</div>
                </div>
                <div class="flex h-full w-full items-center p-4">USER</div>
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
                <div v-if="appReady && tempLoading === false" class="w-full overflow-y-auto">
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
                      :belongUser="value.belongUser.email"
                      @cardId="deleteItemsFunc"
                    />
                  </div>
                </div>
                <div
                  v-else
                  class="ma top-50 absolute z-50 flex h-full w-full items-center justify-center"
                >
                  <v-progress-circular
                    :size="100"
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
    <!--  <div v-else>
      <AuthPage @main-page="pageChecker" @token="getTableDatas" />
    </div> -->
  </div>

  <LoadingBarCard :loadingButton="loadingButton" :updateNumber="updateProgressNumber" />
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

/* .notExistAlert {
  border-color: red !important;
} */

.detailTransition-enter-active,
.detailTransition-leave-active {
  transition: opacity 0.5s ease;
}

.detailTransition-enter-from,
.detailTransition-leave-to {
  opacity: 0;
}
</style>
