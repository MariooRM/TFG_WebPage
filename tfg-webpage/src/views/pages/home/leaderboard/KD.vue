<template>
    <div>
      <TabMenuComponent />
      <DataTable class="flex-grow text-xl" :value="items" size="large" style="border-radius: 7px; white-space: nowrap;">
        <Column header="Rank" class="px-5">
          <template #body="slotProps">
            <div class="rank-column">
              <img v-if="slotProps.data.rank === 1" src="@/assets/images/leaderboard/gold-trophy.png" alt="Gold Medal" class="rank-img" style="object-fit: cover; border-radius: 50%; width: 80px; height: 100%;" />
              <img v-else-if="slotProps.data.rank === 2" src="@/assets/images/leaderboard/silver-trophy.png" alt="Silver Medal" class="rank-img" style="object-fit: cover; border-radius: 50%; width: 80px; height: 100%;"/>
              <img v-else-if="slotProps.data.rank === 3" src="@/assets/images/leaderboard/bronze-trophy.png" alt="Bronze Medal" class="rank-img" style="object-fit: cover; border-radius: 50%; width: 80px; height: 100%;"/>
              <span v-else class="text-3xl">{{ slotProps.data.rank }}</span>
            </div>
          </template>
        </Column>
        <Column header="Player">
          <template #body="slotProps">
            <div class="player-column">
              <img :src="userInfoStore.profileImg" alt="ProfileImg" class="profile-img mr-3" style="object-fit: cover; border-radius: 50%; width: 50px; height: 100%;" />
              <span>{{ slotProps.data.username }}</span>
            </div>
          </template>
        </Column>
        <Column field="playedTime" header="Played time"></Column>
      </DataTable>
    </div>
  </template>
  
  <script setup>
  /**
   * @module Leaderboard/KD
   * @description KD view for the leaderboard page
   */
    import { useUserInfoStore } from '@/stores';
    import TabMenuComponent from '@/components/TabMenuComponent.vue';
    
    const userInfoStore = useUserInfoStore();
    
    const items = [
      { rank: 1, playedTime: '2:30:00', username: 'Player 1', profileImg: 'path/to/paco.jpg' },
      { rank: 2, playedTime: '2:00:00', username: 'Player 2', profileImg: 'path/to/jugador2.jpg' },
      { rank: 3, playedTime: '1:45:00', username: 'Player 3', profileImg: 'path/to/jugador3.jpg' },
      { rank: 4, playedTime: '1:15:00', username: 'Player 4', profileImg: 'path/to/jugador4.jpg' },
      { rank: 5, playedTime: '1:00:00', username: 'Player 5', profileImg: 'path/to/jugador5.jpg' }
    ];
  </script>
  
  <style scoped>
  .player-column {
    display: flex;
    align-items: center;
  }
  
  .rank-img {
    margin-left: -15px;
  }
  </style>
  