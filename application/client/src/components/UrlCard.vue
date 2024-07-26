<script setup lang="ts">
import { ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';

const showDetails = ref<boolean>(false);

const toggleDetails = () => {
  showDetails.value = !showDetails.value;
};

interface LanguageLocation {
  locacalStorage: boolean;
  sessionnStorage: boolean;
  metaTag: boolean;
  htmlTag: boolean;
  url: boolean;
  paragraph: boolean;
}


interface result {
  url: string;
  detectedLanguage: string;
  detectedPlaces: string[];
  languageLocation: LanguageLocation;
  langName: string;
  langNativeName: string;
}

const props = defineProps<result>();
</script>

<template>
  <div class="cols-3 mt-3 grid rounded-md border border-gray-300">
    <div class="h-full p-4">{{ props.url }}</div>
    <div class="h-full w-full p-4">{{ props.detectedLanguage }} - {{ props.langName }} - {{ props.langNativeName }}</div>
    <div class="flex h-full w-full items-center justify-between p-4">
      <div>
        <span v-for="(place , index) in props.detectedPlaces" :key="index"
          >{{ place
          }}<span v-if="place !== props.detectedPlaces[props.detectedPlaces.length - 1]">, </span>
        </span>
      </div>
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
    <!-- <div class="w-4/5">-</div> -->
    <transition name="detailTransition">
      <div v-if="showDetails" class="col-span-3 p-4">
        <div class="bg-#F2F2F2 mb-5 h-[1px] w-full border-t"></div>
        <div class="grid cols-2">
          <div>
            <span class="font-600 mr-2 text-[#2F33B0]">Description: </span>
            <span v-if="props.languageLocation.paragraph === true" class="font-400"
              >Sitenin içeriğinin dilinin de bulunan ögelerle uyuştuğu tespit edilmiştir.</span
            >
          </div>
          <div class="ml-3">
            <span class="font-600 mr-2 text-[#2F33B0]">Accuracy: </span>
            <span> Yakında güvenilirlik grafiğimiz eklencektir!</span>
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
