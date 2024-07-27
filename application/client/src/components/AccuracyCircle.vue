<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{ accuracy: string }>();

const color = ref('red');

if (props.accuracy === 'high') {
  color.value = 'green';
} else if (props.accuracy === 'medium') {
  color.value = 'yellow';
} else {
  color.value = 'red';
}
</script>
<template>
  <div class="h-5 w-5 rounded-full" :class="`bg-${color}`"></div>
</template>
