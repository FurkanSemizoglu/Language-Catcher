<script setup lang="ts">
const props = defineProps<{ loadingButton: boolean }>();
</script>

<template>
  <transition name="detailTransition">
    <div
      v-if="loadingButton"
      class="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-[#F2F2F2] bg-opacity-60"
    >
      <div class="rounded-lg bg-white p-5">
        <div class="flex  flex-col items-center justify-center gap-4 p-4">
          <div class="text-3xl mb-5">Yükleniyor ...</div>
          <div class="text-align-center w-500px">
            <div class="progress progress-striped">
              <div class="progress-bar"></div>
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
 /*  background-color: #ee303c; */
  border-radius: 4px;
  transition: 0.4s linear;
  transition-property: width, background-color;
}

.progress-striped .progress-bar {
  /* background-color: #fcbc51; */
  width: 100%;
  background-image: linear-gradient(90deg, rgba(47, 51, 176, 1) 0%, rgba(136, 138, 211, 1) 100%);
  animation: progressAnimationStrike 6s;
}

@keyframes progressAnimationStrike {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}
</style>
