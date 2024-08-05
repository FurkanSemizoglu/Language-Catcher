<script setup lang="ts">
import { ref, watch  , defineEmits } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
/* import { faSquare } from '@fortawesome/free-solid-svg-icons'; */
/* import { faSquareCheck } from '@fortawesome/free-solid-svg-icons'; */
import { faSquareCheck } from '@fortawesome/free-regular-svg-icons';
import { faSquare } from '@fortawesome/free-regular-svg-icons';
import { urlCardResultProps } from '../types';
import AccuracyCircle from '../components/AccuracyCircle.vue';
import axios from 'axios';

const props = defineProps<urlCardResultProps>();
const localeDate = new Date(props.date).toLocaleString('tr-TR');
const detectedLanguagesText = ref<string>('');
const cardId = ref<string[]>([]);
const model = ref<string>('');
const checkbox = ref<boolean>(false);
const emit = defineEmits<{
  (e: 'cardId', id: string): void;
}>();

if (props.detectedLanguage === 'not detected') {
  detectedLanguagesText.value = 'Dil tespit edilemedi';
} else {
  detectedLanguagesText.value =
    props.detectedLanguage + ' - ' + props.langName + ' - ' + props.langNativeName;
}

/* import AccuracyCircle from './AccuracyCircle.vue' */
const showDetails = ref<boolean>(false);

const deleteCard = async () => {
  console.log('id', props.id);
  try {
    const response = await axios.delete('http://localhost:5000/api/deleteLanguage', {
      params: { email: props.email, languageId: props.id }
    });

    console.log('abi gitti artık ', response.data);
    location.reload();
  } catch (error) {
    console.log(error);
  }
};

const paragraphText = ref<string>('');
const paragraphTextFunc = () => {
  if (props.languageLocation.paragraph === true) {
    paragraphText.value =
      'Sitenin içeriğinin dilinin de bulunan ögelerle uyuştuğu tespit edilmiştir.';
  }

  if (props.detectedLanguage === 'not detected') {
    paragraphText.value = 'Kullanıcıdan ekstra veri alınız';
  }
};
paragraphTextFunc();
const realValueText = ref<string>('');
const realValueTextFunc = () => {
  if (props.realLangValues.realLangAttr !== '') {
    realValueText.value = 'Lang Etiketi : ' + props.realLangValues.realLangAttr;
  }
  if (props.realLangValues.realLangPath !== '') {
    /*   console.log("url card props", props.realLangValues); */
    realValueText.value +=
      realValueText.value === ''
        ? ' Lang Path : ' + props.realLangValues.realLangPath
        : '  -  Lang Path : ' + props.realLangValues.realLangPath;
  }
  if (props.realLangValues.realLangMeta !== '') {
    realValueText.value +=
      realValueText.value === ''
        ? ' Lang Meta : ' + props.realLangValues.realLangMeta
        : '  -  Lang Meta : ' + props.realLangValues.realLangMeta;
  }
};
realValueTextFunc();

const checkboxFunc = () => {
  if (checkbox.value === true) {
    cardId.value.push(props.id);
    console.log('cardId', cardId);
  } else {
    cardId.value = cardId.value.filter((item) => item !== props.id);
    console.log('cardId', cardId);
  }

  checkbox.value = !checkbox.value;
  console.log('allItemSelected', props.allItemsSelected);
};

watch(
  () => props.allItemsSelected,
  (newValue) => {
    if (newValue) {
      checkbox.value = true;
      cardId.value.push(props.id);
    } else {
      checkbox.value = false;
      cardId.value = cardId.value.filter((item) => item !== props.id);
    }
    emit('cardId', cardId.value[0]);
  }
);

/* if(props.allItemsSelected){
  checkbox.value = true;
}
 */
</script>

<template>
  <div
    class="cols-7 min-h-100px grid h-auto border border-gray-300"
    style="grid-template-columns: 0.5fr 1.5fr 2fr 2fr 2fr 2fr 2fr"
    :class="checkbox ? 'bg-[#EBEAEA]' : index % 2 === 0 ? 'bg-white' : 'bg-[#FCFCFC]'"
  >
    <div class="flex h-full w-full items-center p-4">
      <FontAwesomeIcon
        :icon="checkbox ? faSquareCheck : faSquare"
        @click="
          checkboxFunc();
          $emit('cardId', props.id);
        "
        class="cursor-pointer"
      />
    </div>
    <div class="flex h-full w-full items-center justify-center p-4 text-[#A2A0A1]">
      {{ props.index + 1 }}
    </div>
    <div class="flex h-auto w-full items-center justify-between p-4">
      <div class="max-w-full break-words">{{ props.url }}</div>
    </div>
    <div class="flex h-full w-full items-center justify-between p-4">
      {{ detectedLanguagesText }}
    </div>
    <div class="flex h-full w-full items-center justify-between p-4">
      <div>
        <span v-for="(place, index) in props.detectedPlaces" :key="index"
          >{{ place
          }}<span v-if="place !== props.detectedPlaces[props.detectedPlaces.length - 1]">, </span>
        </span>
      </div>
    </div>
    <div class="ml-5 flex h-full w-full items-center p-4">
      <AccuracyCircle :accuracy="props.accuracy" />
      <!--    <div v-if="props.accuracy === 'high'" class="ml-2">
        <div class="rounded-full w-5 h-5 bg-green"></div>
      </div> -->
    </div>
    <div class="flex h-full w-full items-center justify-between p-4">
      <div class="ml-2 max-w-min">{{ localeDate }}</div>
      <div>
        <FontAwesomeIcon
          :icon="faTrashCan"
          class="mr-4 transform cursor-pointer transition-transform duration-300"
          :class="{ hidden: !showDetails }"
          color="red"
          @click="deleteCard()"
        />

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
      <div v-if="showDetails" class="col-span-7 p-4">
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
