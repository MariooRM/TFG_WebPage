<template>
    <div>
      <!-- No content needed -->
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  
  const router = useRouter();
  const route = useRoute();
  
  onMounted(() => {
    const mode = route.query.mode;
    const oobCode = route.query.oobCode;
  
    console.log('Mode:', mode);
    console.log('oobCode:', oobCode);
  
    if (mode === 'resetPassword') {
      console.log('Redirecting to recovery_password');
      if (oobCode) {
        router.push({ path: '/auth/recovery_password', query: { oobCode } });
      } else {
        console.error('Missing oobCode parameter');
      }
    } else if (mode === 'verifyEmail') {
      console.log('Redirecting to verify_email');
      router.push({ path: '/auth/verify_email', query: { oobCode } });
    } else {
      console.error('Unknown mode');
    }
  });
  </script>
  