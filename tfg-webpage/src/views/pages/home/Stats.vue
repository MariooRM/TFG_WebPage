<template>
  <div class="stats-div flex flex-column md:flex-row w-full" style="border: 1px solid black;">
    <div class="left-div md:w-6 md:px-5" style="border: 1px solid black;">
      <Card style="width: 50rem; overflow: hidden;" class="w-full mb-3">
        <template #content>
          <div class="profile-div flex justify-content-start justify-content-center md:justify-content-center w-full flex-column" style="align-items: center;">
            <div class="profile-img-div" style=" border-radius: 50%; width: 200px; height: 200px; ">
              <img :src="userInfoStore.profileImg" alt="ProfileImg" class="profile-img" style="object-fit: cover; border-radius: 50%; width: 100%; height: 100%; " />
            </div>
            <h3 class="" v-text="userInfoStore.username"></h3>
          </div>
        </template>
      </Card>
      <div class="w-full flex flex-column justify-content-center align-items-start mb-3">
          <Paginator class="w-full" v-model:first="currentPage" :rows="1" :totalRecords="statsStore.totalGames" template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink" @update:currentPage="handlePageChange"/>
      </div>
      <Card class=" stats-card w-full mb-3">
        <template #content>
          <h2>Game slot #{{ statsStore.gamesData[currentPage]["id"] }}</h2>
          <div class="game-slot-div p-2 mt-5 flex flex-row gap-3" style="border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <div>
              <h4>Played Time: </h4>
              <h4>Kills: </h4>
              <h4>Deaths: </h4>
              <h4>K/D: </h4>
              <h4>Headshots: </h4>
              <h4>Memories: </h4>
              <h4>Collectibles: </h4>
            </div>
            <div>
              <h4>{{statsStore.gamesData[currentPage]["playedTime"]}} </h4>
              <h4>{{statsStore.gamesData[currentPage]["kills"]}} </h4>
              <h4>{{statsStore.gamesData[currentPage]["deaths"]}} </h4>
              <h4>{{statsStore.gamesData[currentPage]["k/d"]}} </h4>
              <h4>{{statsStore.gamesData[currentPage]["headshots"]}} </h4>
              <h4>{{statsStore.gamesData[currentPage]["memories"]}} </h4>
              <h4>{{statsStore.gamesData[currentPage]["collectibles"]}} </h4>
            </div>
            
          </div>
        </template>
      </Card>
    </div>
    <div class="right-div md:w-6 flex justify-content-center md:px-5 mt-5 md:mt-0 mb-2">
      
    </div>
  
  
  </div>
    
    
</template>

<script setup>
import { ref, watch } from 'vue';
import { useUserInfoStore, useStatsStore } from '@/stores';

const userInfoStore = useUserInfoStore();
const statsStore = useStatsStore();
const currentPage = ref(0);

watch(currentPage);



</script>

<style scoped>

</style>
