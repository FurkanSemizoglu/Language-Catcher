<script setup lang="ts">
import { defineProps, onMounted, ref, watch } from 'vue'

const props = defineProps<{ loadingButton: boolean; updateNumber: number }>()
const progressDegree = ref<number>(0)
progressDegree.value === 0

watch(
  () => props.updateNumber,
  (newValue) => {
    if (newValue) {
      progressDegree.value = newValue * 100
      if (progressDegree.value === 100) {
        setTimeout(() => {
          progressDegree.value = 0
        }, 4000)
      }
    }
  }
)

console.log('loadi,ng cardddd', props.updateNumber)
progressDegree.value = props.updateNumber * 100
if (progressDegree.value === 100) {
  setTimeout(() => {
    progressDegree.value = 0
  }, 4000)
}
</script>

<template>
  <transition name="detailTransition">
    <div
      v-if="props.loadingButton"
      class="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-[#F2F2F2] bg-opacity-60"
    >
      <div class="rounded-lg bg-white p-5">
        <div class="flex flex-col items-center justify-center gap-4 p-4">
          <div class="mb-5 text-3xl">
            Yükleniyor ...
            <!--  <div class="loading loading03 text-3xl font-500">
              <span>L</span>
              <span>O</span>
              <span>A</span>
              <span>D</span>
              <span>I</span>
              <span>N</span>
              <span>G</span>
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </div> -->
          </div>
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
.loading {
  font-size: 84px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 800;
  text-align: center;
}

.loading span {
  display: inline-block;
  margin: 0 -0.05em;
}

.loading03 span {
  margin: 0 -0.075em;
  animation: loading03 0.7s infinite alternate;
}

.loading03 span:nth-child(2) {
  animation-delay: 0.1s;
}

.loading03 span:nth-child(3) {
  animation-delay: 0.2s;
}

.loading03 span:nth-child(4) {
  animation-delay: 0.3s;
}

.loading03 span:nth-child(5) {
  animation-delay: 0.4s;
}

.loading03 span:nth-child(6) {
  animation-delay: 0.5s;
}

@keyframes loading03 {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0.8);
  }
}

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
