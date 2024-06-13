
<template>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <div style="border-radius: 53px; padding: .3rem; background: linear-gradient(180deg, black 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card pb-8 pt-4 px-5 sm:px-8" style="border-radius: 53px;">
                    <div class="text-center mb-5">
                        <img src="../../../assets/images/Logo02.png" alt="EM logo" class="mb-5 w-20rem flex-shrink-0"/>

                        <!-- <Avatar icon="pi pi-user" size="large" shape="circle" class="mb-3" /> -->
                        <div class="text-900 text-3xl font-medium mb-3">Welcome!</div>
                        <span class="text-600 font-medium text-xl">Introduce your new password</span>
                    </div>

                    <div @keydown.enter="handleEventKey" class="recovery-form">
                        <div class="input-fields">
                            <label for="oobCode" class="block text-900 text-xl font-medium mb-2">Token</label>
                            <div>
                                <InputText id="oobCode" v-model="oobCode" type="text" placeholder="Token" class="w-full md:w-30rem text-lg" style="padding: 1rem" disabled />
                            </div> 

                            <label for="new-password" class="block text-900 font-medium text-xl mb-2 mt-5">New password</label>
                            <div>
                                <Password id="new-password" v-model="newPassword" v-tooltip.right="'At least 8 characters, \none lowercase,\n one uppercase and one number'" :feedback="false" placeholder="New password" :toggleMask="true" class="w-full md:w-30rem" inputClass="w-full text-lg" :inputStyle="{ padding: '1rem' }"></Password>
                                <span v-if="errorMessages.newPassword" class="error-message text-red-500 block mt-2 text-lg">{{ errorMessages.newPassword }}</span>
                            </div>

                            <label for="confirm-new-password" class="block text-900 font-medium text-xl mb-2 mt-5">Confirm new password</label>
                            <div>
                                <Password id="confirm-new-password" v-model="confirmNewPassword" :feedback="false" placeholder="New password" :toggleMask="true" class="w-full" inputClass="w-full text-lg" :inputStyle="{ padding: '1rem' }"></Password>
                                <span v-if="errorMessages.confirmNewPassword" class="error-message text-red-500 block mt-2 text-lg">{{ errorMessages.confirmNewPassword }}</span>
                            </div>
                            
                         </div>
                        
                        <Button id="recoveryButton" label="Reset password" class="w-full p-3 text-xl mt-5" :style="{ backgroundColor: bgColor, marginBottom: '5px', marginTop: '10px' }" @click="resetPassword"></Button>
                        <!-- <Button label="Back" class="w-full p-3 text-xl" :style="{ backgroundColor: bgColor }" @click="goBack"></Button>  -->
                    </div>
                </div>
            </div>
        </div>
    </div>
    <AppConfig simple />
</template>

<script setup>
    import AppConfig from '@/layout/AppConfig.vue';
    import { useLayout } from '@/layout/composables/layout';

    import { ref, computed, onMounted } from 'vue';
    import { useRouter } from 'vue-router';
    
    import { toast } from 'vue3-toastify';
    import 'vue3-toastify/dist/index.css';

    import { useAuthStore, useUserInfoStore } from '@/stores';

    const { layoutConfig } = useLayout();

        
    const router = useRouter();
    const authStore = useAuthStore();
    const userInfoStore = useUserInfoStore();

    const oobCode = ref('');
    const newPassword = ref('');
    const confirmNewPassword = ref('');

    const newPasswordValid = ref(false);
    const confirmNewPasswordValid = ref(false);


    const errorMessages = ref({
        newPassword: '',
        confirmNewPassword: ''
    })

    onMounted(() => {
        const route = router.currentRoute.value;
        if (route.query.oobCode) {
            oobCode.value = route.query.oobCode;
        }
    })

    const bgColor = computed(() => {
        return layoutConfig.darkTheme.value ? 'white' : 'black';
    });

    function handleEventKey(event) {
        if (event.key === 'Enter') {
            const recoveryButton = document.getElementById('recoveryButton');
            if (recoveryButton) {
                recoveryButton.click();
            }
        }
    }


    function goBack()
    {
        router.push("/");
    }

    async function resetPassword()
    {
        // Check password integrity
        [errorMessages.value.newPassword, newPasswordValid.value] = userInfoStore.checkPassword(newPassword.value);
        console.log(newPasswordValid.value)
        if (!newPasswordValid.value) {
            return;
        }
       
        // Check password confirmation
        [errorMessages.value.confirmNewPassword, confirmNewPasswordValid.value] = userInfoStore.checkConfirmPassword(newPassword.value, confirmNewPassword.value);
        if (!confirmNewPasswordValid.value) {
            return;
        }
         
        // Reset user's password
        const success = await authStore.resetPassword(oobCode.value, newPassword.value);
        if (success)
        {
            showToast('info', 'Password successfully reset, redirecting to login page...');
            setTimeout(() => {
                router.push("/auth/login");
            }, 2000);
        }
        else
        {
            showToast('error', 'Password reset failed, please try again later');
        }

        
    }

    function showToast (type, message)
    {
        toast(message, {
            "theme": "colored",
            "type": type,
            "autoClose": 1500,
            "dangerouslyHTMLString": true
            })
    }


</script>
<style scoped>

.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}

.error-message {
    font-size: .9em;
}

.surface-ground {
    background: linear-gradient(to bottom, #f0f0f0, #d9d9d9); }
</style>
