<template>
    <div>
      <TabMenuComponent />
      <DataTable class="flex-grow text-xl mb-5" :value="statsStore.killsRanking" size="large" style="border-radius: 7px; white-space: nowrap;">
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
        <Column field="kills" header="Kills" class="w-20rem"></Column>
      </DataTable>
    </div>
  </template>
  
  <script setup>
  /**
   * @module Leaderboard/Kills
   * @description Kills view for the leaderboard page
   */
    import { useStatsStore } from '@/stores';
    import TabMenuComponent from '@/components/TabMenuComponent.vue';
    
    const statsStore = useStatsStore();

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
  