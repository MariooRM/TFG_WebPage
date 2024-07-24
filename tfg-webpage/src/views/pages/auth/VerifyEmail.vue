<template>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, black 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8 flex flex-column align-items-center" style="border-radius: 53px">
                    <div class="grid flex flex-column align-items-center">
                        <div class="flex justify-content-center align-items-center bg-black border-circle" style="height: 3.2rem; width: 3.2rem; background-color: black;">
                            <i class="pi pi-fw pi-verified text-2xl text-white"></i>
                        </div>
                        <h1 class="text-900 font-bold text-5xl mb-2">Email verified</h1>
                        <span class="text-600 mb-5">You can now close this window</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <AppConfig simple />
</template>
  
  <script setup>
  import AppConfig from '@/layout/AppConfig.vue';
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { getAuth, applyActionCode } from 'firebase/auth';
  
  const route = useRoute();
  const loading = ref(true);
  const success = ref(false);
  const error = ref('');
  
  onMounted(async () => {
    const auth = getAuth();
    const oobCode = route.query.oobCode;
  
    if (oobCode) {
    try {
        await applyActionCode(auth, oobCode);
        success.value = true;
    } catch (err) {
        console.error('Error verifying email:', err);
        error.value = 'Failed to verify email. Please try again.';
    } finally {
        loading.value = false;
    }
    } else {
    error.value = 'Missing verification code.';
    loading.value = false;
    }
    
  });
  </script>
