<template>
    <Card style="width: 50rem; overflow: hidden;" class="w-full md:w-5 mb-3">
      <template #content>
        <div class="profile-div flex justify-content-start justify-content-center md:justify-content-start w-full md:ml-5 flex-column md:flex-row" style="align-items: center;">
          <div class="profile-img-div" style=" border-radius: 50%; width: 200px; height: 200px; ">
            <img :src="userInfoStore.profileImg" alt="ProfileImg" class="profile-img" style="object-fit: cover; border-radius: 50%; width: 100%; height: 100%; " />
          </div>
          <h3 class="md:ml-5" v-text="userInfoStore.username"></h3>
        </div>
      </template>
    </Card>
    <div class="w-full md:w-5 flex flex-column justify-content-center align-items-start">
        <Paginator class="w-full" v-model:first="currentPage" :rows="1" :totalRecords="5" template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink" @update:currentPage="handlePageChange"/>
    </div>
    
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useUserInfoStore, useStatsStore } from '@/stores';

const userInfoStore = useUserInfoStore();
const statsStore = useStatsStore();
const currentPage = ref(0);
let p = ref(1);

watch(currentPage, handlePageChange);

const games = ref([
  { id: 1, playedTime: '2:30', kills: 10, deaths: 5, headshots: 3, memories: 'Yes', collectibles: 'No' },
  { id: 2, playedTime: '1:45', kills: 8, deaths: 3, headshots: 2, memories: 'No', collectibles: 'Yes' },
  { id: 3, playedTime: '3:15', kills: 12, deaths: 7, headshots: 4, memories: 'Yes', collectibles: 'Yes' },
]);

function handlePageChange() {
  
}
</script>
