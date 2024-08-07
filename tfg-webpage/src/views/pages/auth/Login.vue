
<template>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <div style="border-radius: 53px; padding: .3rem; background: linear-gradient(180deg, black 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card pb-8 pt-4 px-5 sm:px-8" style="border-radius: 53px;">
                    <div class="text-center mb-5">
                        <img src="../../../assets/images/Logo02.png" alt="EM logo" class="mb-5 w-20rem flex-shrink-0"/>

                        <!-- <Avatar icon="pi pi-user" size="large" shape="circle" class="mb-3" /> -->
                        <div class="text-900 text-3xl font-medium mb-3">Welcome!</div>
                        <span class="text-600 font-medium text-xl">Sign in to continue</span>
                    </div>

                    <div @keydown.enter="handleEventKey" class="login-form">
                        <div class="input-fields">
                            <label for="email" class="block text-900 text-xl font-medium mb-2">Email</label>
                            <div>
                                <InputText id="email" v-model="email" type="text" placeholder="Email address" class="w-full md:w-30rem text-lg" style="padding: 1rem" />
                                <span v-if="errorMessages.email" class="error-message text-red-500 block mt-2">{{ errorMessages.email }}</span>
                            </div>

                            <label for="password" class="block text-900 font-medium text-xl mb-2 mt-5">Password</label>
                            <div>
                                <Password id="password" v-model="password" :feedback="false" placeholder="Password" :toggleMask="true" class="w-full" inputClass="w-full text-lg" :inputStyle="{ padding: '1rem' }"></Password>
                                <span v-if="errorMessages.password" class="error-message text-red-500 block mb-5 mt-2">{{ errorMessages.password }}</span>
                            </div>
                            
                         </div>
                        
                        <div class="flex align-items-center justify-content-left mb-5 gap-5 mt-5">
                            <a class="font-medium text-lg no-underline ml-auto text-right cursor-pointer font-bold" style="color: lightslategray" onclick="window.location.href='/auth/forgot_password'">Forgot password?</a>    
                        </div>
                        <div class="flex align-items-center justify-content-center">
                            <a class="font-medium no-underline ml-2 mb-2 text-center cursor-pointer font-bold text-lg" style="color: lightslategray" onclick="window.location.href='/auth/register'">Don't have an account? Register now</a>
                        </div>
                        <Button id="signInButton" label="Sign In" class="w-full p-3 text-xl" :style="{ backgroundColor: bgColor, marginBottom: '5px', marginTop: '10px' }" @click="login"></Button>
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
 * @module Auth/Login
 * @description Login view for email and password input and login
 * @autor Mario Rodrigo Marcos @MariooRM on GitHub
 */
    import AppConfig from '@/layout/AppConfig.vue';
    import { useLayout } from '@/layout/composables/layout';

    import { ref, computed, onMounted } from 'vue';
    import { useRouter } from 'vue-router';
    
    import { toast } from 'vue3-toastify';
    import 'vue3-toastify/dist/index.css';

    import { useAuthStore } from '@/stores';

    const { layoutConfig } = useLayout();
    const email = ref('');
    const password = ref('');
    const router = useRouter();
    const authStore = useAuthStore();

    const errorMessages = ref({
        email: '',
        password: ''
    })

    /**
     * @event onMounted
     * @description Initializes the email value if it comes from the register view
     */
    onMounted(() => {
        const route = router.currentRoute.value;
        if (route.query.email) {
            email.value = decodeURIComponent(route.query.email.toString());
        }
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
            const signInButton = document.getElementById('signInButton');
            if (signInButton) {
                signInButton.click();
            }
        }
    }

    /**
     * @event login
     * @description Logs in the user
     */
    async function login() 
    {
        if (!makeComprobations()) {
            return;
        } 
        else {
            authStore.login(email.value, password.value)
                .then((logged) => { 
                    if (logged) {
                        console.log("Logged in successfully");
                        showToast('info', 'Successfully logged in!');
                        setTimeout(() => {
                            router.push('/home/dashboard');
                        }, 2000);
                    } else {
                        showToast('error', 'Wrong email or password, please try again');
                    }
                })
                .catch((error) => {
                    console.error("Error during login:", error);
                    showToast('error', 'An error occurred during login. Please try again later.');
                });
        }
    }

    /**
     * @event goBack
     * @description Returns to the landing page
     */
    function goBack()
    {
        router.push("/");
    }

    /**
     * @event showToast
     * @description Shows a toast notification
     * @param {string} type - Notification type (info, success, error, etc.)
     * @param {string} message - Notification message
     */
    function showToast (type, message)
    {
        toast(message, {
            "theme": "colored",
            "type": type,
            "autoClose": 1500,
            "dangerouslyHTMLString": true
            })
    }

    /**
     * @event checkEmail
     * @description Checks if the email is valid
     * @returns {boolean}
     */
    function checkEmail()
    {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value || !emailRegex.test(email.value))
        {
            errorMessages.value.email = 'You must provide a valid email';
            return false;
        }
        else
        {
            errorMessages.value.email = '';
        }

        return true;
    }

    /**
     * @event checkPassword
     * @description Checks if the password is valid
     * @returns {boolean}
     */
    function checkPassword()
    {
        if (!password.value)
        {
            errorMessages.value.password = 'You must provide a password';
            return false;
        }
        else errorMessages.value.password = '';
        return true;
    }

    /**
     * @event makeComprobations
     * @description Makes all the comprobations for the login
     * @returns {boolean}
     */
    function makeComprobations()
    {

        if (!checkEmail() || !checkPassword())
        {
            return false;
        } 
        return true;
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
