<script setup>
import { useAuthStore } from '@/stores';
import { useConfirm } from 'primevue/useconfirm';
import { ref } from 'vue';
import AppMenuItem from './AppMenuItem.vue';

const authStore = useAuthStore();
const confirm = useConfirm();

const model = ref([
    {
        label: 'Home',
        items: [
            { label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/home/dashboard' },
            { label: 'Profile', icon: 'pi pi-fw pi-user', to: '/home/profile' },
            { label: 'Stats', icon: 'pi pi-fw pi-chart-bar', to: '/home/stats' },
            { label: 'Leaderboard', icon: 'pi pi-fw pi-crown', to: '/home/leaderboard' },
        ]
    },
    
]);

function showConfirmDialog() {
  confirm.require({
    group: 'headless',
    message: 'Are you sure you want to logout?',
    header: 'Confirmation',
    accept: authStore.logout,
    reject: () => window.location.reload(),
  });
}
</script>

<template>
    <ul class="layout-menu text-lg mt-5">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
    <ConfirmDialog group="headless">
        <template #container="{ message, acceptCallback, rejectCallback }">
            <div class="flex flex-column align-items-center p-5 surface-overlay border-round">
                <div class="border-circle bg-primary inline-flex justify-content-center align-items-center h-6rem w-6rem -mt-8">
                    <i class="pi pi-exclamation-circle text-5xl"></i>
                </div>
                <span class="font-bold text-2xl block mb-2 mt-4">{{ message.header }}</span>
                <p class="mb-0">{{ message.message }}</p>
                <div class="flex align-items-center gap-2 mt-4">
                    <Button label="Confirm" @click="acceptCallback"></Button>
                    <Button label="Cancel" outlined @click="rejectCallback"></Button>
                </div>
            </div>
        </template>
    </ConfirmDialog>
    <div class="flex justify-content-left align-items-center mt-5">
        <Button class="md:w-5 sm:w-3 p-3 ml-3" style="height: 35px;" @click="showConfirmDialog()" type="button" label="Logout"/>
    </div>
    
</template>

<style lang="scss" scoped></style>
