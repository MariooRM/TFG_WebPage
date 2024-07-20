<template>
  <div>
    <TabMenu :model="items" :activeIndex="activeIndex" @tab-change="handleTabChange" class="flex justify-content-center align-items-center gap-7" />
    <router-view></router-view> <!-- Para mostrar los componentes según la ruta -->
  </div>
</template>

<script setup>

  import { ref, watch } from 'vue';
  import { useRouter, useRoute } from 'vue-router';

  import PlayedTimeIcon from '../../../assets/images/icons/played-time-icon.png';
  import KillsIcon from '../../../assets/images/icons/kills-icon.png';
  import DeathsIcon from '../../../assets/images/icons/deaths-icon.png';
  import HeadshotsIcon from '../../../assets/images/icons/headshots-icon.png';
  import KdIcon from '../../../assets/images/icons/kd-icon.png';
  import MemoriesIcon from '../../../assets/images/icons/memories-icon.png';
  import CollectiblesIcon from '../../../assets/images/icons/collectibles-icon.png';

  const router = useRouter();
  const route = useRoute();

  const items = ref([
    { label: 'Played time', icon: PlayedTimeIcon, to: '/leaderboard/played_time' },
    { label: 'Kills', icon: KillsIcon, to: '/leaderboard/kills' },
    { label: 'Deaths', icon: DeathsIcon, to: '/leaderboard/deaths' },
    { label: 'Headshots', icon: HeadshotsIcon, to: '/leaderboard/headshots' },
    { label: 'K/D', icon: KdIcon, to: '/leaderboard/kd' },
    { label: 'Memories', icon: MemoriesIcon, to: '/leaderboard/memories' },
    { label: 'Collectibles', icon: CollectiblesIcon, to: '/collectibles' }
  ]);

  const activeIndex = ref(0);

  watch(route, () => {
    const currentIndex = items.value.findIndex(item => item.to === route.path);
    if (currentIndex !== -1) {
      activeIndex.value = currentIndex;
    }
  });

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
</style>
