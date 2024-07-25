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

interface extensionResult {
  status: string;
  domain: string;
  language: string;
  languageFetchedFrom: string[];
  languageLocation: LanguageLocation;
  languageAccuracy: string;
}

interface result {
    url: string;
    detectedLanguage: string;
    detectedPlaces: string[];
}

const props = defineProps<result>()
</script>

<template>
  <div class="cols-3 mt-3 grid rounded-md border border-gray-300">
    <div class="h-full p-4">{{ props.url }}</div>
    <div class="h-full w-full p-4">{{props.detectedLanguage}}</div>
    <div class="flex h-full w-full items-center justify-between p-4">
      <div><span v-for="place in props.detectedPlaces">{{ place }}<span v-if="place !== props.detectedPlaces[props.detectedPlaces.length-1]">, </span> </span></div>
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
  </div>
</template>
