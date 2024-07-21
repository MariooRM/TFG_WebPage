<template>
    <!-- Contenedor principal que centra el contenido tanto horizontal como verticalmente -->
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <!-- Contenedor interior con estilo de borde y fondo degradado -->
            <div style="border-radius: 53px; padding: .3rem; background: linear-gradient(180deg, black 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card pb-8 pt-4 px-5 sm:px-8" style="border-radius: 53px;">
                    <div class="text-center mb-5">
                        <!-- Logotipo del proyecto -->
                        <img src="../../../assets/images/Logo02.png" alt="EM logo" class="mb-5 w-20rem flex-shrink-0"/>

                        <!-- Mensaje de bienvenida -->
                        <div class="text-900 text-3xl font-medium mb-3">Welcome!</div>
                        <span class="text-600 font-medium text-xl">Enter your email, please</span>
                    </div>

                    <!-- Formulario de recuperación de contraseña -->
                    <div @keydown.enter="handleEventKey" class="login-form">
                        <div class="input-fields mb-5">
                            <label for="email" class="block text-900 text-xl font-medium mb-2">Email</label>
                            <div>
                                <!-- Campo de entrada para el email -->
                                <InputText id="email" v-model="email" type="text" placeholder="Email address" class="w-full md:w-30rem text-lg" style="padding: 1rem" />
                                <!-- Mensaje de error si hay algún problema con el email -->
                                <span v-if="errorMessages.email" class="error-message text-red-500 block mt-2 text-lg">{{ errorMessages.email }}</span>
                            </div>
                         </div>
                        
                        <!-- Botón para enviar el email de recuperación -->
                        <Button id="sendEmailButton" label="Send email" class="w-full p-3 text-xl" :style="{ backgroundColor: bgColor, marginBottom: '5px', marginTop: '10px' }" @click="sendRecoveryEmail"></Button>
                        <!-- Botón para volver atrás -->
                        <Button label="Back" class="w-full p-3 text-xl" :style="{ backgroundColor: bgColor }" @click="goBack"></Button> 
                    </div>
                </div>
            </div>
        </div>
    </div>
    <AppConfig simple />
</template>

<script setup>
/**
 * @module Auth/ForgotPassword
 * @description Forgot password view for email input and recovery email sending
 * @autor Mario Rodrigo Marcos @MariooRM on GitHub
 */
import AppConfig from '@/layout/AppConfig.vue';
import { useLayout } from '@/layout/composables/layout';

import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

import { useAuthStore, useUserInfoStore } from '@/stores';

const { layoutConfig } = useLayout();
const email = ref('');
const router = useRouter();

const authStore = useAuthStore();
const userInfoStore = useUserInfoStore();

const emailValid = ref(false);


const errorMessages = ref({
    email: '',
})

const bgColor = computed(() => {
    return layoutConfig.darkTheme.value ? 'white' : 'black';
});

/**
 * @event handleEventKey
 * @description Handles the keydown event for the form
 * @param {KeyboardEvent} event
 */
function handleEventKey(event) {
    if (event.key === 'Enter') {
        const sendEmailButton = document.getElementById('sendEmailButton');
        if (sendEmailButton) {
            sendEmailButton.click();
        }
    }
}

/**
 * @event goBack
 * @description Returns to the login view
 */
function goBack() {
    router.push("/auth/login");
}

/**
 * @event showToast
 * @description Shows a toast notification
 * @param {string} type - Notification type (info, success, error, etc.)
 * @param {string} message - Notification message
 */
function showToast (type, message) {
    toast(message, {
        "theme": "colored",
        "type": type,
        "autoClose": 1500,
        "dangerouslyHTMLString": true
    });
}

/**
 * @event sendRecoveryEmail
 * @description Sends a recovery email to the user
 * @returns {Promise<void>}
 */
async function sendRecoveryEmail() {
    [errorMessages.value.email, emailValid.value] = await userInfoStore.checkEmail(email.value);
    if (errorMessages.value.email == 'Email already in use' || errorMessages.value.email == '') {
        errorMessages.value.email = '';
        const success = await authStore.sendRecoveryEmail(email.value);
        if (success) {
            showToast('info', 'Recovery email sent, please check your inbox');
        } else {
            showToast('error', 'An error occurred while sending the recovery email');
        }
    } else {
        if (!emailValid.value) {
            return;
        }
    }
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
    background: linear-gradient(to bottom, #f0f0f0, #d9d9d9);
}
</style>
