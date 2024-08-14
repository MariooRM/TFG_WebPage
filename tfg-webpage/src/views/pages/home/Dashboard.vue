<script setup>
/**
 * @module Home/Dashboard
 * @description Dashboard view for the home page
 * @author Mario Rodrigo Marcos @MariooRM on GitHub
 */
import { onMounted, reactive, ref, watch } from 'vue';
import { useUserInfoStore, useAuthStore } from '@/stores';
import { useRouter } from 'vue-router';

import OverallStatsComponent from '../../../components/OverallStatsComponent.vue';

const router = useRouter();
const userInfoStore = useUserInfoStore();

function goTo(view)
{
    router.push(view);
}

</script>

<template>
    <div class="grid">

        <!-- Profile -->
        <div class="col-12 lg:col-5 xl:col-6">
            <div class="card mb-0 flex justify-content-center h-full hover-effect" @click="goTo('/home/profile')">
                <div class="flex flex-column justify-content-center align-items-center" style="overflow: hidden;">
                    <div class="profile-img-div mb-3" style=" border-radius: 50%; width: 250px; height: 250px; ">
                        <img :src="userInfoStore.profileImg" alt="ProfileImg" class="profile-img" style="object-fit: cover; border-radius: 50%; width: 100%; height: 100%; " />
                    </div>
                    <span class="block text-black text-4xl mb-5">{{ userInfoStore.username }}</span>
                </div>
            </div>
        </div>

        <!-- Stats -->
        <div class="col-12 lg:col-5 xl:col-6">
            <OverallStatsComponent class="h-full"/>
            
        </div>

        <!-- Leaderboard -->
        <div class="col-12 lg:col-5 xl:col-6 hover-effect" @click="goTo('/home/stats')">
            <div class="card mb-0 flex justify-content-center">
                <div class="flex flex-column justify-content-center align-items-center" style="overflow: hidden;">
                    <div class="profile-img-div mb-3" style=" border-radius: 50%; width: 250px; height: 250px; ">
                        <img :src="userInfoStore.profileImg" alt="ProfileImg" class="profile-img" style="object-fit: cover; border-radius: 50%; width: 100%; height: 100%; " />
                    </div>
                    <span class="block text-black text-4xl mb-5">{{ userInfoStore.username }}</span>
                    <Button class="md:w-8 sm:w-8 p-3" style="height: 40px;" @click="goTo('/home/profile')" type="button" label="Go to profile" icon="pi pi-user"/>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.grid {
    background: linear-gradient(to bottom, #f0f0f0, #d9d9d9);
}

.hover-effect:hover {
  cursor: pointer;
  background-color: #f0f0f0; 
}
</style>
