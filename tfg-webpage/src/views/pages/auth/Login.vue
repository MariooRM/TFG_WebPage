
<template>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <div style="border-radius: 53px; padding: 0.3rem; background: linear-gradient(180deg, black 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card pb-8 pt-4 px-5 sm:px-8" style="border-radius: 53px;">
                    <div class="text-center mb-5">
                        <img src="../../../assets/images/title-logo-removebg-preview.png" alt="EM logo" class="mb-2 w-20rem flex-shrink-0"/>

                        <!-- <Avatar icon="pi pi-user" size="large" shape="circle" class="mb-3" /> -->
                        <div class="text-900 text-3xl font-medium mb-3">Welcome!</div>
                        <span class="text-600 font-medium">Sign in to continue</span>
                    </div>

                    <div class="login-form">
                        <div class="input-fields">
                            <label for="email" class="block text-900 text-xl font-medium mb-2">Email</label>
                            <div>
                                <InputText id="email" v-model="email" type="text" placeholder="Email address" class="w-full md:w-30rem" style="padding: 1rem" />
                                <span v-if="errorMessages.email" class="error-message text-red-500 block mt-2">{{ errorMessages.email }}</span>
                            </div>

                            <label for="password" class="block text-900 font-medium text-xl mb-2 mt-5">Password</label>
                            <div>
                                <Password id="password" v-model="password" :feedback="false" placeholder="Password" :toggleMask="true" class="w-full" inputClass="w-full" :inputStyle="{ padding: '1rem' }"></Password>
                                <span v-if="errorMessages.password" class="error-message text-red-500 block mb-5 mt-2">{{ errorMessages.password }}</span>
                            </div>
                            
                         </div>
                        
                        <div class="flex align-items-center justify-content-left mb-5 gap-5 mt-5">
                            <a class="font-medium no-underline ml-auto text-right cursor-pointer" style="color: var(--primary-color)">Forgot password?</a>    
                        </div>
                        <div class="flex align-items-center justify-content-center">
                            <a class="font-medium no-underline ml-2 text-center cursor-pointer" style="color: var(--primary-color)" onclick="window.location.href='/auth/register'">Don't have an account? Register now</a>
                        </div>
                        <Button label="Sign In" class="w-full p-3 text-xl" :style="{ backgroundColor: bgColor, marginBottom: '5px', marginTop: '10px' }" @click="login"></Button>
                        <Button label="Back" class="w-full p-3 text-xl" :style="{ backgroundColor: bgColor }" @click="goBack"></Button> 
                    </div>
                </div>
            </div>
        </div>
    </div>
    <AppConfig simple />
</template>

<script setup>
    import { useLayout } from '@/layout/composables/layout';
    import { ref, computed, onMounted } from 'vue';
    import AppConfig from '@/layout/AppConfig.vue';
    import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
    import { toast } from 'vue3-toastify';
    import { useRouter } from 'vue-router';
    import 'vue3-toastify/dist/index.css';


    const { layoutConfig } = useLayout();
    const email = ref('');
    const password = ref('');
    const router = useRouter();

    const errorMessages = ref({
        email: '',
        password: ''
    })

    onMounted(() => {
        const route = router.currentRoute.value;
        if (route.query.email) {
            email.value = decodeURIComponent(route.query.email.toString());
        }
    })

    const logoUrl = computed(() => {
        return `/layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
    });

    const bgColor = computed(() => {
        return layoutConfig.darkTheme.value ? 'white' : 'black';
    });

    function login()
    {
        if (!makeComprobations())
        {
            return;
        }
        else
        {
            firebaseSignIn();
        }
    }

    function goBack()
    {
        router.push("/landing");
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

    function checkEmail()
    {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value || !emailRegex.test(email.value))
        {
            errorMessages.value.email = 'You must provide a valid email!';
            return false;
        }
        else
        {
            errorMessages.value.email = '';
        }

        return true;
    }

    function checkPassword()
    {
        if (!password.value)
        {
            errorMessages.value.password = 'You must provide a password!';
            //showToast('error', 'You must provide a password');
            return false;
        }
        else errorMessages.value.password = '';
        return true;
    }

    function makeComprobations()
    {
        if (!checkEmail() || !checkPassword())
        {
            return false;
        } 
        return true;
    }

    function firebaseSignIn() 
    {
        const auth = getAuth();
        signInWithEmailAndPassword(auth, email.value, password.value)
            .then(() => {
                showToast('info', 'Successfully logged in!');
                setTimeout(() => {
                    router.push('/landing');
                }, 2000);
                
            })
            .catch(() => {
                showToast('error', 'Wrong email or password, please try again');
            });
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
</style>
