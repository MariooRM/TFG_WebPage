<template>
    <div>
      <TabMenuComponent />
      <DataTable class="flex-grow text-xl mb-5" :value="statsStore.kdRanking" size="large" style="border-radius: 7px; white-space: nowrap;">
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
              <div class="profile-img-div mb-3 mr-5 w-5rem h-5rem md:w-8rem md:h-8rem" style=" border-radius: 50%;">
                <img :src="slotProps.data.profileImg" alt="ProfileImg" class="profile-img" style="object-fit: cover; border-radius: 50%; width: 100%; height: 100%; " />
              </div>
              <span>{{ slotProps.data.username }}</span>
            </div>
          </template>
        </Column>
        <Column field="kd" header="K/D" class="w-20rem"></Column>
      </DataTable>
    </div>
  </template>
  
  <script setup>
  /**
   * @module Leaderboard/KD
   * @description KD view for the leaderboard page
   */
    import { useStatsStore } from '@/stores';
    import TabMenuComponent from '@/components/TabMenuComponent.vue';
    
    const statsStore = useStatsStore();
    
    const items = [
      { rank: 1, kd: 1.23, username: 'Player 1', profileImg: 'path/to/paco.jpg' },
      { rank: 2, kd: 1.09, username: 'Player 2', profileImg: 'path/to/jugador2.jpg' },
      { rank: 3, kd: 0.98, username: 'Player 3', profileImg: 'path/to/jugador3.jpg' },
      { rank: 4, kd: 0.5, username: 'Player 4', profileImg: 'path/to/jugador4.jpg' },
      { rank: 5, kd: 0.2, username: 'Player 5', profileImg: 'path/to/jugador5.jpg' }
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
  