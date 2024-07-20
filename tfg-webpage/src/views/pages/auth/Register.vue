
<template>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <div style="border-radius: 53px; padding: 0.3rem; background: linear-gradient(180deg, black 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card pb-8 pt-4 px-5 sm:px-8" style="border-radius: 53px;">
                    <div class="text-center mb-5">
                        <img src="../../../assets/images/Logo02.png" alt="EM logo" class="mb-5 w-20rem flex-shrink-0"/>

                        <!-- <Avatar icon="pi pi-user" size="large" shape="circle" class="mb-3" /> -->
                        <div class="text-900 text-3xl font-medium mb-3">Welcome!</div>
                        <span class="text-600 font-medium text-xl">Sign up to continue</span>
                    </div>

                    <div class="register-form" @keydown.enter="handleEventKey">
                        <form autocomplete="new-password">
                            <div class="input-fields-1" v-if="showFields1">
                            <label for="name" class="block text-900 text-xl font-medium mb-2">Name</label>
                            <div>
                                <InputText id="name" v-model="name" type="text" placeholder="Name" class="w-full md:w-30rem text-lg font-medium" style="padding: 1rem"/>
                                <span v-if="errorMessages.name" class="error-message text-red-500 block mt-2 text-lg">{{ errorMessages.name }}</span>
                            </div>
                            
                            <label for="surname" class="block text-900 text-xl font-medium mb-2 mt-5">Surname</label>
                            <div>
                                <InputText id="surname" v-model="surname" type="text" placeholder="Surname" class="w-full md:w-30rem text-lg font-medium" style="padding: 1rem"/>
                            </div>
                            
                            </div>
                            <div class="input-fields-2" v-if="showFields2">
                                <label for="email" class="block text-900 text-xl font-medium mb-2">Email</label>
                                <div>
                                    <InputText id="email" v-model="email" type="text" placeholder="Email" class="w-full md:w-30rem text-lg font-medium" style="padding: 1rem"/>
                                    <span v-if="errorMessages.email" class="error-message text-red-500 block mt-2 text-lg">{{ errorMessages.email }}</span>
                                </div>
                                
                                <label for="username" class="block text-900 text-xl font-medium mb-2 mt-5">Username</label>
                                <div>
                                    <InputText id="username" v-model="username" type="text" placeholder="Username" class="w-full md:w-30rem text-lg font-medium" style="padding: 1rem"/>
                                    <span v-if="errorMessages.username" class="error-message text-red-500 block mt-2 text-lg">{{ errorMessages.username }}</span>
                                </div>
                                
                            </div>
                            <div class="input-fields-3" v-if="showFields3">
                                <label for="password" class="block text-900 font-medium text-xl mb-2">Password</label>
                                <div>
                                    <Password id="password" v-model="password" v-tooltip.right="'At least 8 characters, \none lowercase,\n one uppercase and one number'" :feedback="false" placeholder="Password" :toggleMask="true" class="w-full md:w-30rem text-lg font-medium" inputClass="w-full text-lg" :inputStyle="{ padding: '1rem' }"></Password>
                                    <span v-if="errorMessages.password" class="error-message text-red-500 block mt-2 text-lg">{{ errorMessages.password }}</span>
                                </div>
                            
                            <label for="confirmPassword" class="block text-900 font-medium text-xl mb-2 mt-5">Confirm password</label>
                            <div>
                                <Password id="confirmPassword" v-model="confirmPassword" :feedback="false" placeholder="Confirm password" :toggleMask="true" class="w-full md:w-30rem text-lg font-medium" inputClass="w-full text-lg" :inputStyle="{ padding: '1rem' }"></Password>
                                <span v-if="errorMessages.confirmPassword" class="error-message text-red-500 block mt-2 text-lg">{{ errorMessages.confirmPassword }}</span>
                            </div>
                            
                            </div>
                        </form>
                        
                        
                        
                        <div class="flex align-items-center justify-content-between mb-3 gap-5">
                            
                        </div>
                        <div class="flex align-items-center justify-content-center">
                            <a class="font-medium no-underline ml-2 mb-2 text-center cursor-pointer mt-3 font-bold text-lg" style="color: lightslategray" onclick="window.location.href='/auth/login'">Already have an account? Sign in</a>
                        </div>
                        <Button id="nextButton" :label="firstButton" class="w-full p-3 text-xl" :style="{ backgroundColor: bgColor, marginBottom: '5px', marginTop: '10px' }" @click="goNext"></Button>
                        <Button v-if="showButton" label="Back" class="w-full p-3 text-xl" :style="{ backgroundColor: bgColor }" @click="goBack"></Button> 
                    </div>
                </div>
            </div>
        </div>
    </div>
    <AppConfig simple />
</template>

<script setup>
/**
 * @module Auth/Register
 * @description Register view for user registration
 * @autor Mario Rodrigo Marcos @MariooRM on GitHub
 */
    import { useLayout } from '@/layout/composables/layout';
    import AppConfig from '@/layout/AppConfig.vue';
    
    import { ref, computed } from 'vue';
    import { useRouter } from 'vue-router';

    import { toast } from 'vue3-toastify';
    import 'vue3-toastify/dist/index.css';

    import { useAuthStore } from '@/stores';
    import { useUserInfoStore } from '@/stores';

    const { layoutConfig } = useLayout();
    const autStore = useAuthStore();
    const userInfoStore = useUserInfoStore();

    const firstButton = ref('Next');
    const showButton = ref(false);
    const showFields1 = ref(true);
    const showFields2 = ref(false);
    const showFields3 = ref(false);
    const phase = ref(1);

    const name = ref('');
    const surname = ref('');
    const email = ref('');
    const username = ref('');
    const password = ref('');
    const confirmPassword = ref('');

    const usernameValid = ref(false);
    const emailValid = ref(false);
    const nameValid = ref(false);

    const errorMessages = ref({
        name: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
    });

    const router = useRouter();

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
            const nextButton = document.getElementById('nextButton');
            if (nextButton) {
                nextButton.click();
            }
        }
    }

    /**
     * @event goBack
     * @description Goes back to the previous registration phase
     */
    function goBack()
    {
        if (phase.value == 1)
        {
            showButton.value = false;
            router.push('/auth/login');
        }
        else if (phase.value == 2)
        {
            showButton.value = false;
            showFields1.value = true;
            showFields2.value = false;
            phase.value = 1;
        }
        else if (phase.value == 3)
        {
            firstButton.value = 'Next';
            showFields2.value = true;
            showFields3.value = false;
            phase.value = 2;
        }
    }

    /**
     * @event goNext
     * @description Goes to the next registration phase
     */
    async function goNext()
    {
        if (phase.value == 1) // Name comprobation
        {
            [errorMessages.value.name, nameValid.value] = userInfoStore.checkName(name.value);

            if (!nameValid.value){
                return;
            }
            else
            {
                showButton.value = true;
                phase.value = 2;
                showFields1.value = false;
                showFields2.value = true;
            }
            
        }
        else if (phase.value == 2) // Username and email comprobation
        {
            [errorMessages.value.email, emailValid.value] = await userInfoStore.checkEmail(email.value);
          
            if (!emailValid.value)
            {
                return;
            }
            
            [errorMessages.value.username, usernameValid.value] = await userInfoStore.checkUsername(username.value);
            if (!usernameValid.value)
            {
                return;
            }
            else
            {
                phase.value = 3;
                showFields2.value = false;
                showFields3.value = true;
                firstButton.value = 'Register';
            }
        }
        else if (phase.value == 3)
        {
            if (!checkPasswordAndConfirmPassword())
            {
                return;
            }
            else
            {
                try
                {
                    const {userCredential, userData} = await autStore.register(name.value, surname.value, email.value, username.value, password.value);
                    await autStore.sendEmail(userCredential, userData, email.value);
                }
                catch(error)
                {
                    showToast('error', error.message);
                }
            }
        }
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
            "autoClose": 2000,
            "dangerouslyHTMLString": true
            })
    }

    /**
     * @event checkPasswordAndConfirmPassword
     * @description Checks if the password and confirm password fields are valid
     * @returns {boolean}
     */
    function checkPasswordAndConfirmPassword()
    {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        if (!password.value || !passwordRegex.test(password.value))
        {
            errorMessages.value.password = 'You must provide a valid password';
            return false;
        }
        else errorMessages.value.password = '';

        if (!confirmPassword.value)
        {
            errorMessages.value.confirmPassword = 'Password confirmation is needed';
            return false; 
        }
        else if (password.value != confirmPassword.value)
        {
            errorMessages.value.confirmPassword = 'Passwords do not match';
            return false;
        }
        else errorMessages.value.confirmPassword = '';
        
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

.input-group {
    display: flex;
    flex-direction: column;
    text-align: center;
    justify-content: center;
    margin-left: 20px;
    margin-right: 10px;
  }

.error-message {
    font-size: .9em;
}

.surface-ground {
    background: linear-gradient(to bottom, #f0f0f0, #d9d9d9);
}
</style>
