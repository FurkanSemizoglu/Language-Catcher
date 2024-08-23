<script setup lang="ts">
import { ref, watch, defineEmits } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import { faTrashCan } from '@fortawesome/free-solid-svg-icons'
/* import { faSquare } from '@fortawesome/free-solid-svg-icons'; */
/* import { faSquareCheck } from '@fortawesome/free-solid-svg-icons'; */
import { faSquareCheck } from '@fortawesome/free-regular-svg-icons'
import { faSquare } from '@fortawesome/free-regular-svg-icons'
import type { urlCardResultProps } from '../types'
import AccuracyCircle from './AccuracyCircle.vue'
import axios from 'axios'

const props = defineProps<urlCardResultProps>()
const localeDate = new Date(props.date).toLocaleString('tr-TR')
const detectedLanguagesText = ref<string>('')
const cardId = ref<string[]>([])
const model = ref<string>('')
const checkbox = ref<boolean>(false)
const emit = defineEmits<{
  (e: 'cardId', id: string): void
}>()

if (props.detectedLanguage === 'not detected') {
  detectedLanguagesText.value = 'Dil tespit edilemedi'
} else {
  detectedLanguagesText.value =
    props.detectedLanguage + ' - ' + props.langName + ' - ' + props.langNativeName
}

/* import AccuracyCircle from './AccuracyCircle.vue' */
const showDetails = ref<boolean>(false)

const deleteCard = async () => {
  console.log('id', props.id)
  try {
    const response = await axios.delete('http://localhost:5000/api/deleteLanguage', {
      params: { email: props.email, languageId: props.id }
    })

    console.log('abi gitti artık ', response.data)
    location.reload()
  } catch (error) {
    console.log(error)
  }
}

const paragraphText = ref<string>('')
const paragraphTextFunc = () => {
  if (props.languageLocation.paragraph === true) {
    paragraphText.value =
      'Sitenin içeriğinin dilinin de bulunan ögelerle uyuştuğu tespit edilmiştir.'
  }

  if (props.detectedLanguage === 'not detected') {
    paragraphText.value = 'Kullanıcıdan ekstra veri alınız'
  }
}
paragraphTextFunc()
const realValueText = ref<string>('')
const realValueTextFunc = () => {
  if (props.realLangValues.realLangAttr !== '') {
    realValueText.value = 'Lang Etiketi : ' + props.realLangValues.realLangAttr
  }
  if (props.realLangValues.realLangPath !== '') {
    /*   console.log("url card props", props.realLangValues); */
    realValueText.value +=
      realValueText.value === ''
        ? ' Lang Path : ' + props.realLangValues.realLangPath
        : '  -  Lang Path : ' + props.realLangValues.realLangPath
  }
  if (props.realLangValues.realLangMeta !== '') {
    realValueText.value +=
      realValueText.value === ''
        ? ' Lang Meta : ' + props.realLangValues.realLangMeta
        : '  -  Lang Meta : ' + props.realLangValues.realLangMeta
  }
}
realValueTextFunc()

const checkboxFunc = () => {
  if (checkbox.value === true) {
    cardId.value.push(props.id)
    console.log('cardId', cardId)
  } else {
    cardId.value = cardId.value.filter((item) => item !== props.id)
    console.log('cardId', cardId)
  }

  checkbox.value = !checkbox.value
  console.log('allItemSelected', props.allItemsSelected)
}

watch(
  () => props.allItemsSelected,
  (newValue) => {
    if (newValue) {
      checkbox.value = true
      cardId.value.push(props.id)
    } else {
      checkbox.value = false
      cardId.value = cardId.value.filter((item) => item !== props.id)
    }
    emit('cardId', cardId.value[0])
  }
)

function getDomainFromUrl(url: string) {
  const parsedUrl = new URL(url)
  return parsedUrl.hostname
}

const url = props.url
const domain = getDomainFromUrl(url)
/* const iconUrl = `https://icon.horse/icon/${domain}` */
const iconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`

const detectedLangCode = ref<string>('')
/* const tempLangCode = props.detectedLanguage.split('-')[0]
detectedLangCode.value = tempLangCode[0].toUpperCase() + tempLangCode.slice(1)  */
detectedLangCode.value = props.detectedLanguage.split('-')[0].toUpperCase()

if(props.detectedLanguage === 'not detected'){
  detectedLangCode.value = '-'
}

/* if(props.allItemsSelected){
  checkbox.value = true;
}
 */



const openNewTab = () => {
  window.open(props.url, '_blank')
}

</script>

<template>
  <div
    class="cardHeight cols-8  grid h-auto border border-gray-300"
    style="grid-template-columns: 0.5fr 1.5fr 2fr 2fr 2fr 2fr 2fr 2fr"
    :class="checkbox ? 'bg-[#EBEAEA]' : index % 2 === 0 ? 'bg-white' : 'bg-white'"
  >
    <div class="flex h-full w-full items-center px-4">
      <FontAwesomeIcon
        :icon="checkbox ? faSquareCheck : faSquare"
        @click="checkboxFunc(), $emit('cardId', props.id)"
        class="cursor-pointer"
      />
    </div>
    <div class="flex h-full w-full items-center justify-center px-4 text-[#A2A0A1]">
      {{ props.index + 1 }}
    </div>
    <div class="flex h-auto w-full items-center justify-between px-4">
      <div
        class="iconContainer max-w-full break-words flex items-center justify-between gap-2 cursor-pointer" @click="openNewTab"
      >
        <div class="iconImage">
          <img :src="iconUrl" width="24px" class="z-1" />
        </div>
        <div class="propsDiv">{{ domain }}</div>
      </div>
    </div>

    <div class="langContainer flex h-full w-full items-center justify-between px-4 gap-2 cursor-pointer">
      <div>
        {{ detectedLangCode }}
      </div>
      <div class="langDiv">
        {{ detectedLanguagesText }}
      </div>
    </div>
    <div class="flex h-full w-full items-center justify-between px-4">
      <div>
        <span v-for="(place, index) in props.detectedPlaces" :key="index"
          >{{ place
          }}<span v-if="place !== props.detectedPlaces[props.detectedPlaces.length - 1]">, </span>
        </span>
      </div>
    </div>
    
    <AccuracyCircle :accuracy="props.accuracy" />
    <div class="flex h-full w-full items-center px-4">
      <div class="max-w-full break-words">{{ props.belongUser }}</div>
    </div>
    <div class="flex h-full w-full items-center justify-between px-4">
      <div class="ml-2 max-w-min">{{ localeDate }}</div>
      <div>
        <!--   <FontAwesomeIcon
          :icon="faTrashCan"
          class="mr-4 transform cursor-pointer transition-transform duration-300"
          :class="{ hidden: !showDetails }"
          color="red"
          @click="deleteCard()"
        /> -->

        <FontAwesomeIcon
          :icon="faAngleDown"
          class="mr-2 transform cursor-pointer transition-transform duration-300"
          :class="{ 'rotate-0': showDetails, 'rotate-90': !showDetails }"
          @click="showDetails = !showDetails"
        />
      </div>
    </div>

    <!-- <div class="w-4/5">-</div> -->
    <transition name="detailTransition">
      <div v-if="showDetails" class="col-span-8 px-4">
        <!-- <div class="bg-#F2F2F2 mb-5 h-[1px] w-full border-t"></div> -->
        <div class="cols-2 grid">
          <div>
            <span class="font-600 mr-2 text-[#2F33B0]">Description: </span>
            <span class="font-400">{{ paragraphText }}</span>
          </div>
          <div class="ml-3">
            <span class="font-600 mr-2 text-[#2F33B0]">Real Values: </span>
            <span> {{ realValueText }}</span>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>

.cardHeight{
  min-height: 100px;
}
.propsDiv {
  opacity: 0;
  transform: translateX(0);
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.iconContainer:hover .propsDiv {
  opacity: 1;
  transform: translateX(10px);
}


.langDiv {
  opacity: 0;
  transform: translateX(0);
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.langContainer:hover .langDiv {
  opacity: 1;
  transform: translateX(10px);
}

.accuracyDiv {
  opacity: 0;
  transform: translateX(0);
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.accuracyContainer:hover .propsDiv {
  opacity: 1;
  transform: translateX(10px);
}

/*
.icon-container {
  position: relative;
  width: 100%;
}

.iconImage::after {
  content: attr(data-url);
  background: red;
  height: 10px;
  width: 100%;
  position: absolute;
  right: 0;
  transition: 100ms;
}

.icon-container::after:hover {
  content: attr(data-url);
}

*/
/* .url-text {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateX(-100%) translateY(-50%);
  white-space: nowrap;
  opacity: 0;
  transition: transform 0.3s ease, opacity 0.3s ease;
  font-size: 10px;
  color: #333;
}

.icon-container:hover .url-text {
  transform: translateX(0) translateY(-50%);
  opacity: 1;
}
 */

.detailTransition-enter-active,
.detailTransition-leave-active {
  transition: opacity 0.5s ease;
}

.detailTransition-enter-from,
.detailTransition-leave-to {
  opacity: 0;
}

.break-words {
  word-break: break-word;
}
</style>
