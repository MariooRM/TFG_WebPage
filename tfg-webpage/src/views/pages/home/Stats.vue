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
      <Card class="w-full mb-2">
        <template #content>
          <div class="charts-div flex flex-column align-items-center justify-content-center">
            
            <div class="first-row flex flex-row mb-7 gap-5 jusitfy-content-center align-items-center">
              <div class="kills-chart flex flex-column align-items-center">
                <h3 class="text-xl">Kills</h3>
                <Chart id="kills" type="pie" :data="killsChartData" :options="chartOptions" class="w-10rem md:w-15rem" />
              </div>
              <div class="deaths-chart flex flex-column align-items-center">
                <h3 class="text-xl">Deaths</h3>
                <Chart id="deaths" type="pie" :data="deathsChartData" :options="chartOptions" class="w-10rem md:w-15rem" />
              </div>
            </div>

            <div class="second-row flex flex-row mb-7 gap-5 jusitfy-content-center align-items-center">
              <div class="headshots-chart flex flex-column align-items-center">
                <h3 class="text-xl">Heashots</h3>
                <Chart id="headshots" type="pie" :data="headshotsChartData" :options="chartOptions" class="w-10rem md:w-15rem" />
              </div>
              <div class="kd-chart flex flex-column align-items-center">
                <h3 class="text-xl">K/D Chart</h3>
                <Chart id="kd" type="pie" :data="kdChartData" :options="chartOptions" class="w-10rem md:w-15rem" />
              </div>
            </div>

            <div class="third-row flex flex-row gap-5 jusitfy-content-center align-items-center">
              <div class="memories-chart flex flex-column align-items-center">
                <h3 class="text-xl">Memories</h3>
                <Chart id="memories" type="pie" :data="memoriesChartData" :options="chartOptions" class="w-10rem md:w-15rem" />
              </div>
              <div class="collectibles-chart flex flex-column align-items-center">
                <h3 class="text-xl">Collectibles</h3>
                <Chart id="collectibles" type="pie" :data="collectiblesChartData" :options="chartOptions" class="w-10rem md:w-15rem" />
              </div>
            </div>
            
            
          </div>
        </template>
      </Card>
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

const router = useRouter();
const userInfoStore = useUserInfoStore();
const statsStore = useStatsStore();
const authStore = useAuthStore();

const gameSlots = computed(() => {
  const totalGames = statsStore.totalGames;
  return totalGames > 0 ? Array.from({ length: totalGames }, (_, i) => `${i}`) : [];
});

onMounted(() => {
  statsStore.fetchUserGamesDocs(authStore.userUID);
});


/**
 * Data for the Kills chart.
 * @type {ref<Chart.ChartData>}
 */
const killsChartData = ref();

/**
 * Data for the Deaths chart.
 * @type {ref<Chart.ChartData>}
 */
const deathsChartData = ref();

/**
 * Data for the Headshots chart.
 * @type {ref<Chart.ChartData>}
 */
const headshotsChartData = ref();

/**
 * Data for the K/D chart.
 * @type {ref<Chart.ChartData>}
 */
const kdChartData = ref();

/**
 * Data for the Memories chart.
 * @type {ref<Chart.ChartData>}
 */
const memoriesChartData = ref();

/**
 * Data for the Collectibles chart.
 * @type {ref<Chart.ChartData>}
 */
const collectiblesChartData = ref();

/**
 * Options for the chart.
 * @type {ref<Chart.ChartData>}
 */
const chartOptions = ref();

const chartColors = {
  backgroundColor: ['#6C757D', '#17A2B8', '#343A40', '#DC3545', '#6610F2', '#28A745'],
  hoverBackgroundColor: ['#6C757D', '#17A2B8', '#343A40', '#DC3545', '#6610F2', '#28A745']
};

/**
 * @event setKillsChartData
 * @description Sets the data for the Kills chart.
 * @returns {Chart.ChartData}
 */
function setKillsChartData() {
  const gamesData = statsStore.gamesData;

  const labels = Object.keys(gamesData).map(key => `Slot ${parseInt(key)}`);
  const data = Object.values(gamesData).map(game => game["kills"]);

  return {
    labels,
    datasets: [
      {
        data,
        backgroundColor: chartColors.backgroundColor,
        hoverBackgroundColor: chartColors.hoverBackgroundColor
      }
    ]
  };
}

/**
 * @event setDeathsChartData
 * @description Sets the data for the Deaths chart.
 * @returns {Chart.ChartData}
 */
function setDeathsChartData() {
  const gamesData = statsStore.gamesData;

  const labels = Object.keys(gamesData).map(key => `Slot ${parseInt(key)}`);
  const data = Object.values(gamesData).map(game => game["deaths"]);

  return {
    labels,
    datasets: [
      {
        data,
        backgroundColor: chartColors.backgroundColor,
        hoverBackgroundColor: chartColors.hoverBackgroundColor
      }
    ]
  };
}

/**
 * @event setHeadshotsChartData
 * @description Sets the data for the Headshots chart.
 * @returns {Chart.ChartData}
 */
function setHeadshotsChartData() {
  const gamesData = statsStore.gamesData;

  const labels = Object.keys(gamesData).map(key => `Slot ${parseInt(key)}`);
  const data = Object.values(gamesData).map(game => game["headshots"]);

  return {
    labels,
    datasets: [
      {
        data,
        backgroundColor: chartColors.backgroundColor,
        hoverBackgroundColor: chartColors.hoverBackgroundColor
      }
    ]
  };
}

/**
 * @event setKDChartData
 * @description Sets the data for the K/D chart.
 * @returns {Chart.ChartData}
 */
function setKDChartData() {
  const gamesData = statsStore.gamesData;

  const labels = Object.keys(gamesData).map(key => `Slot ${parseInt(key)}`);
  const data = Object.values(gamesData).map(game => game["kd"]);

  return {
    labels,
    datasets: [
      {
        data,
        backgroundColor: chartColors.backgroundColor,
        hoverBackgroundColor: chartColors.hoverBackgroundColor
      }
    ]
  };
}

/**
 * @event setCollectiblesChartData
 * @description Sets the data for the Collectibles chart.
 * @returns {Chart.ChartData}
 */
function setCollectiblesChartData() {
  const gamesData = statsStore.gamesData;

  const labels = Object.keys(gamesData).map(key => `Slot ${parseInt(key)}`);
  const data = Object.values(gamesData).map(game => game["collectibles"]);

  return {
    labels,
    datasets: [
      {
        data,
        backgroundColor: chartColors.backgroundColor,
        hoverBackgroundColor: chartColors.hoverBackgroundColor
      }
    ]
  };
}

/**
 * @event setMemoriesChartData
 * @description Sets the data for the Memories chart.
 * @returns {Chart.ChartData}
 */
function setMemoriesChartData() {
  const gamesData = statsStore.gamesData;

  const labels = Object.keys(gamesData).map(key => `Slot ${parseInt(key)}`);
  const data = Object.values(gamesData).map(game => game["memories"]);

  return {
    labels,
    datasets: [
      {
        data,
        backgroundColor: chartColors.backgroundColor,
        hoverBackgroundColor: chartColors.hoverBackgroundColor
      }
    ]
  };
}

/**
 * @event setChartOptions
 * @description Sets the options for the chart.
 * @returns {Chart.ChartData}
 */
function setChartOptions() {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--text-color');

  return {
    plugins: {
      legend: {
        labels: {
          usePointStyle: true,
          color: textColor
        }
      }
    }
  };
}

/**
 * @event goToGameDetails
 * @description Redirects to the game slot details page.
 * @param gameSlot 
 */

function goToGameDetails(gameSlot)
{
  console.log(gameSlot, typeof gameSlot);
  router.push(`/home/game_details?gameSlot=${encodeURIComponent(gameSlot+1)}`);
}


watch(() => statsStore.gamesData, () => {
  killsChartData.value = setKillsChartData();
  deathsChartData.value = setDeathsChartData();
  headshotsChartData.value = setHeadshotsChartData();
  kdChartData.value = setKDChartData();
  memoriesChartData.value = setMemoriesChartData();
  collectiblesChartData.value = setCollectiblesChartData();
}, { deep: true });

onMounted(() => {
  killsChartData.value = setKillsChartData();
  deathsChartData.value = setDeathsChartData();
  headshotsChartData.value = setHeadshotsChartData();
  kdChartData.value = setKDChartData();
  chartOptions.value = setChartOptions();
  memoriesChartData.value = setMemoriesChartData();
  collectiblesChartData.value = setCollectiblesChartData();
});
</script>
