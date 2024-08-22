<script setup lang="ts">
import { ref, watch } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faSquareCheck } from '@fortawesome/free-regular-svg-icons'
import { faSquare } from '@fortawesome/free-regular-svg-icons'
const props = defineProps<{ user: string }>()
const shortName = ref<string>('')
shortName.value = props.user.substring(0, 2).toUpperCase()
console.log('shortName', shortName.value)
const openProfileDetail = ref<boolean>(false)
watch(
  () => props.user,
  (newValue) => {
    shortName.value = newValue.substring(0, 2).toUpperCase()
  }
)
/* const shortName = props.user.substring(0, 2).toUpperCase() */

const logOut = () => {
 chrome.runtime.sendMessage({ message: 'logOut' } , (response)=> {
    console.log('response', response)
    if(response.status){
      location.reload()
    }
  })
 
}
</script>
<template>
  <div
    v-if="props.user"
    class="relative"
    @mouseenter="openProfileDetail = true"

  >
    <div
      class="w-25px h-25px p-3 mb-1 border border-[#2F33B0]! flex items-center justify-center cursor-pointer"
    >
      {{ shortName }}
    </div>
    <div  v-if="openProfileDetail"  @mouseleave="openProfileDetail = false" class="detailUser absolute left-8 -top-8 border border-[#2F33B0]! flex flex-col items-center gap-4 p-4">
      <div>
        {{ props.user }}
      </div>

      <div class="cursor-pointer text-[#2F33B0] " @click="logOut">Çıkış Yap</div>
    </div>

    <!-- <div v-if="openProfileDetail" class="absolute left-4 -top-4 bg-red">
      <div>
        {{ props.user }}
      </div>

      <div>Çıkış Yap</div>
    </div> -->
  </div>
  <!--   <div class="ml-2">
    <FontAwesomeIcon :icon="faSquare" class="cursor-pointer" />
   
  </div> -->
</template>


<style scoped>
.detailUser{
  top: -60px;
}
</style>