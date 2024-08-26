<template>
  <div class="stats-div flex flex-column md:flex-row w-full">
    <div class="left-div md:w-6 md:px-5">
      <Card style="width: 50rem; overflow: hidden;" class="w-full mb-3">
        <template #content>
          <div class="profile-div flex justify-content-start justify-content-center md:justify-content-center w-full flex-column" style="align-items: center;">
            <div class="profile-img-div" style="border-radius: 50%; width: 200px; height: 200px;">
              <img :src="userInfoStore.profileImg" alt="ProfileImg" class="profile-img" style="object-fit: cover; border-radius: 50%; width: 100%; height: 100%;" />
            </div>
            <h3 v-text="userInfoStore.username"></h3>
          </div>
        </template>
      </Card>

      <Card class="stats-card w-full mb-3">
        <template #content>
          <h2 class="text-center">Game slots</h2>
          <div class="game-slot-div p-2 mt-5 flex justify-content-center align-items-center gap-3" style="border-radius: 8px; background: linear-gradient(to bottom, #f0f0f0, #d9d9d9);;">
            
            <VirtualScroller :items="gameSlots" :itemSize="parseInt(statsStore.totalGames)" class="border border-surface-200 dark:border-surface-700 rounded w-full bg-white" style="height: 200px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
              <template v-slot:item="{ item, index }">
                <div
                  :class="['flex items-center p-2 cursor-pointer transition-colors duration-300 justify-content-center align-items-center', { 'bg-gray-100': parseInt(item) % 2 !== 0, 'hover:bg-gray-200': true }]"
                  @click="goToGameDetails(item)"
                >
                  <h4>Slot #{{ parseInt(item) + 1 }}</h4>
                </div>
              </template>
            </VirtualScroller>

          </div>
        </template>
      </Card>
    </div>
    <div class="right-div md:w-6 flex justify-content-center md:px-2 mt-5 md:mt-0 mb-2">
      <OverallStatsComponent></OverallStatsComponent>
    </div>
  </div>
</template>


<script setup>
/**
 * User stats view
 * @module Home/Stats
 */
import { ref, watch, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserInfoStore, useStatsStore, useAuthStore } from '@/stores';

import OverallStatsComponent from '../../../components/OverallStatsComponent.vue';

const router = useRouter();
const userInfoStore = useUserInfoStore();
const statsStore = useStatsStore();
const authStore = useAuthStore();

const gameSlots = computed(() => {
  const totalGames = 3;
  return totalGames > 0 ? Array.from({ length: totalGames }, (_, i) => `${i}`) : [];
});

onMounted(() => {
  statsStore.fetchUserGamesDocs(authStore.userUID);
});


/**
 * @event goToGameDetails
 * @description Redirects to the game slot details page.
 * @param gameSlot 
 */

function goToGameDetails(gameSlot)
{
  router.push(`/home/game_details?gameSlot=${encodeURIComponent(parseInt(gameSlot) + 1)}`);
}


watch(() => statsStore.gamesData, () => {
}, { deep: true });

</script>
