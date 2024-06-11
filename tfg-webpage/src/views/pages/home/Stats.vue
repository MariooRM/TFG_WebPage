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
      <div class="w-full flex flex-column justify-content-center align-items-start mb-3">
        <Paginator class="w-full" v-model:first="currentPage" :rows="1" :totalRecords="parseInt(statsStore.totalGames)" template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink" />
      </div>
      <Card class="stats-card w-full mb-3">
        <template #content>
          <h2>Game slot #{{ statsStore.gamesData[currentPage]?.id }}</h2>
          <div class="game-slot-div p-2 mt-5 flex flex-row gap-3" style="border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <div>
              <h4>Played Time:</h4>
              <h4>Kills:</h4>
              <h4>Deaths:</h4>
              <h4>K/D:</h4>
              <h4>Headshots:</h4>
              <h4>Memories:</h4>
              <h4>Collectibles:</h4>
            </div>
            <div>
              <h4>{{ statsStore.gamesData[currentPage]?.playedTime }}</h4>
              <h4>{{ statsStore.gamesData[currentPage]?.kills }}</h4>
              <h4>{{ statsStore.gamesData[currentPage]?.deaths }}</h4>
              <h4>{{ statsStore.gamesData[currentPage]?.['k/d'] }}</h4>
              <h4>{{ statsStore.gamesData[currentPage]?.headshots }}</h4>
              <h4>{{ statsStore.gamesData[currentPage]?.memories }}</h4>
              <h4>{{ statsStore.gamesData[currentPage]?.collectibles }}</h4>
            </div>
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

            <div class="third-row flex flex-row mb-7 gap-5 jusitfy-content-center align-items-center">
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
import { ref, watch, onMounted } from 'vue';
import { useUserInfoStore, useStatsStore } from '@/stores';

const userInfoStore = useUserInfoStore();
const statsStore = useStatsStore();
const currentPage = ref(0);

/**
 * Data for the Kills chart.
 * @type {import('vue').Ref<Chart.ChartData>}
 */
const killsChartData = ref();

/**
 * Data for the Deaths chart.
 * @type {import('vue').Ref<Chart.ChartData>}
 */
const deathsChartData = ref();

/**
 * Data for the Headshots chart.
 * @type {import('vue').Ref<Chart.ChartData>}
 */
const headshotsChartData = ref();

/**
 * Data for the K/D chart.
 * @type {import('vue').Ref<Chart.ChartData>}
 */
const kdChartData = ref();

/**
 * Data for the Memories chart.
 * @type {import('vue').Ref<Chart.ChartData>}
 */
const memoriesChartData = ref();

/**
 * Data for the Collectibles chart.
 * @type {import('vue').Ref<Chart.ChartData>}
 */
const collectiblesChartData = ref();

/**
 * Options for the chart.
 * @type {import('vue').Ref<Chart.ChartOptions>}
 */
const chartOptions = ref();

const chartColors = {
  backgroundColor: ['#6C757D', '#17A2B8', '#343A40', '#DC3545', '#6610F2', '#28A745'],
  hoverBackgroundColor: ['#6C757D', '#17A2B8', '#343A40', '#DC3545', '#6610F2', '#28A745']
};


/**
 * Sets the data for the Kills chart.
 */
function setKillsChartData()
{
  const documentStyle = getComputedStyle(document.body);
  const gamesData = statsStore.gamesData;

  const labels = Object.keys(gamesData).map(key => `Slot ${parseInt(key)+1}`);
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
};

/**
 * Sets the data for the Deaths chart.
 */
function setDeathsChartData() 
{
  const documentStyle = getComputedStyle(document.body);
  const gamesData = statsStore.gamesData;

  const labels = Object.keys(gamesData).map(key => `Slot ${parseInt(key)+1}`);
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
};

/**
 * Sets the data for the Headshots chart.
 */
function setHeadshotsChartData() 
{
  const documentStyle = getComputedStyle(document.body);
  const gamesData = statsStore.gamesData;

  const labels = Object.keys(gamesData).map(key => `Slot ${parseInt(key)+1}`);
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
};

/**
 * Sets the data for the K/D chart.
 */
function setKDChartData() 
{
  const documentStyle = getComputedStyle(document.body);
  const gamesData = statsStore.gamesData;

  const labels = Object.keys(gamesData).map(key => `Slot ${parseInt(key)+1}`);
  const data = Object.values(gamesData).map(game => game["k/d"]);

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
};

/**
 * Sets the data for the Collectibles chart.
 */
function setCollectiblesChartData() 
{
  const documentStyle = getComputedStyle(document.body);
  const gamesData = statsStore.gamesData;

  const labels = Object.keys(gamesData).map(key => `Slot ${parseInt(key)+1}`);
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
};

/**
 * Sets the data for the Memories chart.
 */
function setMemoriesChartData() 
{
  const documentStyle = getComputedStyle(document.body);
  const gamesData = statsStore.gamesData;

  const labels = Object.keys(gamesData).map(key => `Slot ${parseInt(key)+1}`);
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
};


/**
 * Sets the options for the chart.
 */
function setChartOptions()
{
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
};


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
