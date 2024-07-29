<script setup lang="ts">
import { ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { urlCardResultProps } from '../types';
import AccuracyCircle from '../components/AccuracyCircle.vue';
import axios from 'axios';

const props = defineProps<urlCardResultProps>();

const detectedLanguagesText = ref<string>('');
if (props.detectedLanguage === 'not detected') {
  detectedLanguagesText.value = 'Dil tespit edilemedi';
} else {
  detectedLanguagesText.value =
    props.detectedLanguage + ' - ' + props.langName + ' - ' + props.langNativeName;
}

/* import AccuracyCircle from './AccuracyCircle.vue' */
const showDetails = ref<boolean>(false);

const toggleDetails = () => {
  showDetails.value = !showDetails.value;
};

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
</script>

<template>
  <div class="cols-4 mt-3 grid rounded-md border border-gray-300">
    <div class="flex h-full w-full items-center justify-between overflow-auto p-4">
      {{ props.url }}
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
    <div class="flex h-full w-full items-center justify-between p-4">
      <AccuracyCircle :accuracy="props.accuracy" />
      <!--    <div v-if="props.accuracy === 'high'" class="ml-2">
        <div class="rounded-full w-5 h-5 bg-green"></div>
      </div> -->

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
          @click="toggleDetails()"
        />
      </div>
    </div>
    <!-- <div class="w-4/5">-</div> -->
    <transition name="detailTransition">
      <div v-if="showDetails" class="col-span-4 p-4">
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
</style>
