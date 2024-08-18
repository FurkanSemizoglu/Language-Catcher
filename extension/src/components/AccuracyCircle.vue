<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{ accuracy: string }>()
/* 
const color = ref('red'); */


const accuracy = ref<string>(props.accuracy)

accuracy.value = props.accuracy[0].toUpperCase() + props.accuracy.slice(1)
const color = computed(() => {
  if (props.accuracy === 'high') {
    return 'bg-[#1A9278]'
  } else if (props.accuracy === 'medium') {
    return 'bg-[#CBBD2F]'
  } else {
    return 'bg-[#971A58]'
  }
})
</script>
<template>
  <div class="accuracyContainer max-w-full px-6 flex h-full w-full items-center p-4 gap-2 cursor-pointer">
    <div class="h-5 w-5 rounded-full" :class="color"></div>
    <div class="accuracyDiv">
      {{ accuracy}}
    </div>
  </div>
</template>

<style scoped>
.accuracyDiv {
  opacity: 0;
  transform: translateX(0);
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.accuracyContainer:hover .accuracyDiv {
  opacity: 1;
  transform: translateX(10px);
}
</style>
