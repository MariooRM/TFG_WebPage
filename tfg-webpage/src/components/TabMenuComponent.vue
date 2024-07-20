
<template>
  <div class="tabmenu-div" style="width: 100%;">
    <TabMenu :model="items" :activeIndex="activeIndex" @tab-change="handleTabChange" class="text-xl flex align-items-center mb-5" style="border-radius: 7px; width: 100%; background-color: white;"/>
  </div>
  
</template>

<script setup>
/**
 * @module Components/TabMenuComponent
 * @description Tabmenu component used in leaderboard views
 * @author Mario Rodrigo Marcos @MariooRM on GitHub
 * 
 */
import { ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import PlayedTimeIcon from '@/assets/images/icons/played-time-icon.png';
import KillsIcon from '@/assets/images/icons/kills-icon.png';
import DeathsIcon from '@/assets/images/icons/deaths-icon.png';
import HeadshotsIcon from '@/assets/images/icons/headshots-icon.png';
import KdIcon from '@/assets/images/icons/kd-icon.png';
import MemoriesIcon from '@/assets/images/icons/memories-icon.png';
import CollectiblesIcon from '@/assets/images/icons/collectibles-icon.png';

const router = useRouter();
const route = useRoute();
const num = ref(0);

const items = ref([
  { label: 'Played time', icon: PlayedTimeIcon, to: '/leaderboard/played_time' },
  { label: 'Kills', icon: KillsIcon, to: '/leaderboard/kills' },
  { label: 'Deaths', icon: DeathsIcon, to: '/leaderboard/deaths' },
  { label: 'Headshots', icon: HeadshotsIcon, to: '/leaderboard/headshots' },
  { label: 'K/D', icon: KdIcon, to: '/leaderboard/kd' },
  { label: 'Memories', icon: MemoriesIcon, to: '/leaderboard/memories' },
  { label: 'Collectibles', icon: CollectiblesIcon, to: '/collectibles' }
]);

/**
 * A number
 * @type {ref<Number>}
 */
const activeIndex = ref(0);

watch(
  () => route.path,
  (newPath) => {
    const currentIndex = items.value.findIndex(item => item.to === newPath);
    if (currentIndex !== -1) {
      activeIndex.value = currentIndex;
    }
  },
  { immediate: true } 
);

const handleTabChange = (e) => {
  router.push(items.value[e.index].to);
};
</script>

<style>
.tabmenu-icon {
  width: 16px;
  height: 16px;
  display: inline-block;
}

.p-tabmenuitem {
  margin-right: 15px;
  white-space: nowrap;
}
</style>
