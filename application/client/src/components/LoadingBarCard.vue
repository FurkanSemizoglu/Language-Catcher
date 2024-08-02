<script setup lang="ts">
import { defineProps, onMounted, ref } from 'vue';

const props = defineProps<{ loadingButton: boolean }>();
const progressDegree = ref<number>(0);
  progressDegree.value === 0

window.addEventListener('updateProgress', (e) => {
  const event = e as CustomEvent;
  console.log('update progress :', event.detail.progress);

  progressDegree.value = event.detail.progress * 100;

  // burada progress degree 0 olmalı
  if(progressDegree.value === 100) {
    setTimeout(() => {
      progressDegree.value = 0;
    }, 2000);
  }
});
</script>

<template>
  <transition name="detailTransition">
    <div
      v-if="props.loadingButton"
      class="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-[#F2F2F2] bg-opacity-60"
    >
      <div class="rounded-lg bg-white p-5">
        <div class="flex flex-col items-center justify-center gap-4 p-4">
          <div class="mb-5 text-3xl">Yükleniyor ...</div>
          <div>% {{ progressDegree.toFixed(2) }}</div>
          <div class="text-align-center w-500px">
            <div class="progress progress-striped">
              <div class="progress-bar" :style="{ width: progressDegree + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.progress {
  background: rgba(0, 0, 0, 0.25);
  border-radius: 6px;
  box-shadow:
    inset 0 1px 2px rgba(0, 0, 0, 0.25),
    0 1px rgba(255, 255, 255, 0.08);
}

.progress-bar {
  height: 18px;
  border-radius: 4px;
  transition:
    width 0.4s linear,
    background-color 0.4s linear;
}

.progress-striped .progress-bar {
  background-image: linear-gradient(90deg, rgba(47, 51, 176, 1) 0%, rgba(136, 138, 211, 1) 100%);
}
</style>
