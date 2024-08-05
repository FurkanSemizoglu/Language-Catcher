<script setup lang="ts">
import { ref  , computed} from 'vue';

const props = defineProps<{ accuracy: string }>();
/* 
const color = ref('red'); */

const color = computed(() => {
  if (props.accuracy === 'high') {
    return 'bg-[#1A9278]';
  } else if (props.accuracy === 'medium') {
    return 'bg-[#CBBD2F]';
  } else {
    return 'bg-[#971A58]';
  }
});
</script>
<template>
  <div class="h-5 w-5 rounded-full" :class="color"></div>
</template>
