<template>
  <div class="grid">
      <div class="col-12 lg:col-6 xl:col-3">
            <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3 text-3xl">Played time</span>
                        <div class="text-900 font-medium text-2xl">{{ statsStore.gamesData[gameSlot]?.["playedTime"] }}</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-bluegray-200 mb-3" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                        <img alt="dropdown icon" src="/src/assets/images/icons/played-time-icon.png" style="width: 40px;">
                    </div>
                </div>
            </div>
      </div>

      <div class="col-12 lg:col-6 xl:col-3">
          <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3 text-3xl">Kills</span>
                        <div class="text-900 font-medium text-2xl">{{ statsStore.gamesData[gameSlot]?.["kills"] }}</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-bluegray-200 mb-3" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                        <img alt="dropdown icon" src="/src/assets/images/icons/kills-icon.png" style="width: 40px;">
                    </div>
                </div>
                <span v-if="kills > 250" class="text-green-500 text-xl">Somebody called an exterminator?</span>
                <span v-else class="text-red-500 text-xl"></span>
            </div>
      </div>

      <div class="col-12 lg:col-6 xl:col-3">
          <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3 text-3xl">Deaths</span>
                        <div class="text-900 font-medium text-2xl">{{ statsStore.gamesData[gameSlot]?.["deaths"] }}</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-bluegray-200 mb-3" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                        <img alt="dropdown icon" src="/src/assets/images/icons/deaths-icon.png" style="width: 40px;">
                    </div>
                </div>
            <span v-if="deaths < 50" class="text-green-500 text-xl">Death is losing its patience</span>
            <span v-else class="text-red-500 text-xl">You are just fertilizer</span>
          </div>
      </div>

      <div class="col-12 lg:col-6 xl:col-3">
          <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3 text-3xl">Headshots</span>
                        <div class="text-900 font-medium text-2xl">{{ statsStore.gamesData[gameSlot]?.["headshots"] }}</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-bluegray-200 mb-3" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                        <img alt="dropdown icon" src="/src/assets/images/icons/headshots-icon.png" style="width: 40px;">
                    </div>
                </div>
              <span v-if="headshots > kills/2" class="text-green-500 text-xl">You are all a headhunter!</span>
              <span v-else class="text-red-500 text-xl">Don't aim at the feet</span>
          </div>
      </div>

      <div class="col-12 lg:col-6 xl:col-3">
          <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3 text-3xl">K/D</span>
                        <div class="text-900 font-medium text-2xl">{{ statsStore.gamesData[gameSlot]?.["kd"] }}</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-bluegray-200 mb-3" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                        <img alt="dropdown icon" src="/src/assets/images/icons/kd-icon.png" style="width: 40px;">
                    </div>
                </div>
            <span v-if="kd > 1" class="text-green-500 text-xl">Good average, you have a nice aim!</span>
            <span v-else class="text-red-500 text-xl">You need to improve a little bit!</span>
          </div>
      </div>

      <div class="col-12 lg:col-6 xl:col-3">
          <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3 text-3xl">Collectibles</span>
                        <div class="text-900 font-medium text-2xl">{{ statsStore.gamesData[gameSlot]?.["collectibles"] }}</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-bluegray-200 mb-3" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                        <img alt="dropdown icon" src="/src/assets/images/icons/collectibles-icon.png" style="width: 40px;">
                    </div>
                </div>
            <span v-if="collectibles > 25" class="text-green-500 text-xl">The terror of the garden</span>
            <span v-else class="text-red-500 text-xl">Those gnomes are hiding from you</span>
          </div>
      </div>
  </div>
</template>
  
  
<script setup>
/**
 * @module Home/GameDetails
 * @description This component shows the details of the selected game slot.
 * 
 */
  import { ref, onMounted, watch } from 'vue';
  import { useStatsStore, useAuthStore } from '@/stores';
  import { useRouter } from 'vue-router';

  const statsStore = useStatsStore();
  const authStore = useAuthStore();
  const router = useRouter();
  const route = router.currentRoute.value;

  const gameSlot = ref('');
  const kd = ref('');
  const headshots = ref('');
  const kills = ref('');
  const deaths = ref('');
  const collectibles = ref('');

  /**
   * @event onMounted
   * @description This event is triggered when the component is mounted.
   */
  onMounted(() => {
    if (route.query.gameSlot) {
      gameSlot.value = parseInt(decodeURIComponent(route.query.gameSlot.toString()));
      kd.value = statsStore.gamesData[gameSlot.value]?.["kd"];
      headshots.value = statsStore.gamesData[gameSlot.value]?.["headshots"];
      kills.value = statsStore.gamesData[gameSlot.value]?.["kills"];
      deaths.value = statsStore.gamesData[gameSlot.value]?.["deaths"];
      collectibles.value = statsStore.gamesData[gameSlot.value]?.["collectibles"];
    }
    statsStore.fetchUserGamesDocs(authStore.userUID);
  });

 
  watch(() => route.query.gameSlot, (newGameSlot) => {
    gameSlot.value = newGameSlot;
    kd.value = statsStore.gamesData[gameSlot.value]?.["kd"];
    headshots.value = statsStore.gamesData[gameSlot.value]?.["headshots"];
    kills.value = statsStore.gamesData[gameSlot.value]?.["kills"];
    deaths.value = statsStore.gamesData[gameSlot.value]?.["deaths"];
    collectibles.value = statsStore.gamesData[gameSlot.value]?.["collectibles"];
 });

 watch(() => statsStore.gamesData, (newGamesData) => {
    kd.value = statsStore.gamesData[gameSlot.value]?.["kd"];
    headshots.value = statsStore.gamesData[gameSlot.value]?.["headshots"];
    kills.value = statsStore.gamesData[gameSlot.value]?.["kills"];
    deaths.value = statsStore.gamesData[gameSlot.value]?.["deaths"];
    collectibles.value = statsStore.gamesData[gameSlot.value]?.["collectibles"];
 });

</script>

  