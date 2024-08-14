<template>
    <Card 
    :class="['w-full mb-2', { 'hover-effect': shouldApplyEffect }]"
            @click="shouldApplyEffect ? goTo() : null"
    >
        <template #content>
            <div class="charts-div flex flex-column align-items-center justify-content-center">
                
            <div class="first-row flex flex-column md:flex-row mb-7 gap-5 jusitfy-content-center align-items-center">
                <div class="kills-chart flex flex-column align-items-center">
                    <h3 class="text-xl">Kills</h3>
                    <Chart id="kills" type="pie" :data="killsChartData" :options="chartOptions" class="w-10rem md:w-15rem" />
                </div>
                <div class="deaths-chart flex flex-column align-items-center">
                    <h3 class="text-xl">Deaths</h3>
                    <Chart id="deaths" type="pie" :data="deathsChartData" :options="chartOptions" class="w-10rem md:w-15rem" />
                </div>
                <div class="headshots-chart flex flex-column align-items-center">
                    <h3 class="text-xl">Heashots</h3>
                    <Chart id="headshots" type="pie" :data="headshotsChartData" :options="chartOptions" class="w-10rem md:w-15rem" />
                </div>
            </div>

            <div class="second-row flex flex-column md:flex-row mb-7 gap-5 jusitfy-content-center align-items-center">
                <div class="kd-chart flex flex-column align-items-center">
                    <h3 class="text-xl">K/D Chart</h3>
                    <Chart id="kd" type="pie" :data="kdChartData" :options="chartOptions" class="w-10rem md:w-15rem" />
                </div>
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
</template>

<script setup>
/**
 * User stats view
 * @module Components/OverallStats
 */
import { ref, watch, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useStatsStore, useAuthStore } from '@/stores';

const router = useRouter();
const route = useRoute();
const statsStore = useStatsStore();
const authStore = useAuthStore();

const shouldApplyEffect = ref(false);


onMounted(() => {
  statsStore.fetchUserGamesDocs(authStore.userUID);
  killsChartData.value = setKillsChartData();
  deathsChartData.value = setDeathsChartData();
  headshotsChartData.value = setHeadshotsChartData();
  kdChartData.value = setKDChartData();
  chartOptions.value = setChartOptions();
  memoriesChartData.value = setMemoriesChartData();
  collectiblesChartData.value = setCollectiblesChartData();

  if (route.name === "dashboard")
  {
    shouldApplyEffect.value = true;
  }
});

function goTo()
{
    router.push("/home/stats");
}

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

watch(() => statsStore.gamesData, () => {
  killsChartData.value = setKillsChartData();
  deathsChartData.value = setDeathsChartData();
  headshotsChartData.value = setHeadshotsChartData();
  kdChartData.value = setKDChartData();
  memoriesChartData.value = setMemoriesChartData();
  collectiblesChartData.value = setCollectiblesChartData();
}, { deep: true });

</script>

<style scoped>
.hover-effect:hover {
  cursor: pointer;
  background-color: #f0f0f0; 
}
</style>
