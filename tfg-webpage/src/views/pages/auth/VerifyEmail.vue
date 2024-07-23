<template>
    <div>
      <p v-if="loading">Verifying email...</p>
      <p v-if="success">Your email has been verified successfully!</p>
      <p v-if="error">{{ error }}</p>
    </div>
  </template>
  
  <script setup>
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
