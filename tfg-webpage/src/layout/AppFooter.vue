<script setup>
import { useLayout } from '@/layout/composables/layout';
import { computed } from 'vue';

const { layoutConfig } = useLayout();

const logoUrl = computed(() => {
    return `/layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
});
</script>

<template>
    <div class="layout-footer">
        <img src="../assets/images/Logo02.png" alt="Logo" height="80" class="mr-0 lg:mr-2" />
        by
        <span class="font-medium ml-2">Mario Rodrigo Marcos</span>
    </div>
</template>
<style lang="scss" scoped>
.layout-footer {
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>
