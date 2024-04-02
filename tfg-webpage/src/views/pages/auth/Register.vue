
<template>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <div style="border-radius: 53px; padding: 0.3rem; background: linear-gradient(180deg, black 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card pb-8 pt-4 px-5 sm:px-8" style="border-radius: 53px;">
                    <div class="text-center mb-5">
                        <img src="../../../assets/images/title-logo-removebg-preview.png" alt="EM logo" class="mb-2 w-20rem flex-shrink-0"/>

                        <!-- <Avatar icon="pi pi-user" size="large" shape="circle" class="mb-3" /> -->
                        <div class="text-900 text-3xl font-medium mb-3">Welcome!</div>
                        <span class="text-600 font-medium">Sign up to continue</span>
                    </div>

                    <div class="login-form">
                        <div class="input-fields-1" v-if="showFields1">
                            <label for="name" class="block text-900 text-xl font-medium mb-2">Name</label>
                            <InputText id="name" v-model="name" type="text" placeholder="Name" class="w-full md:w-30rem mb-5" style="padding: 1rem"/>
                            
                            <label for="surname" class="block text-900 text-xl font-medium mb-2">Surname</label>
                            <InputText id="surname" v-model="surname" type="text" placeholder="Surname" class="w-full md:w-30rem mb-5" style="padding: 1rem"/>
                        </div>
                        <div class="input-fields-2" v-if="showFields2">
                            <label for="email" class="block text-900 text-xl font-medium mb-2">Email</label>
                            <InputText id="email" v-model="email" type="text" placeholder="Email" class="w-full md:w-30rem mb-5" style="padding: 1rem"/>
                            
                            <label for="username" class="block text-900 text-xl font-medium mb-2">Username</label>
                            <InputText id="usuername" v-model="username" type="text" placeholder="Username" class="w-full md:w-30rem mb-5" style="padding: 1rem"/>
                        </div>
                        <div class="input-fields-3" v-if="showFields3">
                            <label for="password" class="block text-900 font-medium text-xl mb-2">Password</label>
                            <Password id="password" v-model="password" :feedback="true" placeholder="Password" :toggleMask="true" class="w-full md:w-30rem mb-3" inputClass="w-full" :inputStyle="{ padding: '1rem' }">
                            <template #footer>
                                <Divider />
                                    <p class="mt-2">Password must contain</p>
                                    <ul class="pl-2 ml-2 mt-0" style="line-height: 1.5">
                                        <li>At least one lowercase</li>
                                        <li>At least one uppercase</li>
                                        <li>At least one numeric</li>
                                        <li>Minimum 8 characters</li>
                                    </ul>
                            </template>
                        </Password>
                            
                            <label for="repeatPassword" class="block text-900 font-medium text-xl mb-2">Confirm password</label>
                            <Password id="repeatPassword" v-model="repeatPassword" :feedback="false" placeholder="Confirm password" :toggleMask="true" class="w-full mb-3" inputClass="w-full" :inputStyle="{ padding: '1rem' }"></Password>
                        </div>
                        
                        
                        <div class="flex align-items-center justify-content-between mb-3 gap-5">
                            
                        </div>
                        <div class="flex align-items-center justify-content-center">
                            <a class="font-medium no-underline ml-2 text-center cursor-pointer" style="color: var(--primary-color)" onclick="window.location.href='/auth/login'">Already have an account? Sign in</a>
                        </div>
                        <Button :label="firstButton" class="w-full p-3 text-xl" :style="{ backgroundColor: bgColor, marginBottom: '5px', marginTop: '10px' }" @click="goNext"></Button>
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
    import { ref, computed } from 'vue';
    import AppConfig from '@/layout/AppConfig.vue';
    import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
    import { getFirestore, doc, setDoc } from "firebase/firestore";
    import { Timestamp } from 'firebase/firestore';
    import { toast } from 'vue3-toastify';
    import { useRouter } from 'vue-router';
    import 'vue3-toastify/dist/index.css';


    const { layoutConfig } = useLayout();

    const firstButton = ref('Next');
    const showFields1 = ref(true);
    const showFields2 = ref(false);
    const showFields3 = ref(false);
    const phase = ref(1);

    const name = ref('');
    const surname = ref('');
    const email = ref('');
    const username = ref('');
    const password = ref('');
    const repeatPassword = ref('');

    const router = useRouter();

    const logoUrl = computed(() => {
        return `/layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
    });

    const bgColor = computed(() => {
        return layoutConfig.darkTheme.value ? 'white' : 'black';
    });

    function goBack()
    {
        if (phase.value == 1)
        {
            router.push('/auth/login');
        }
        else if (phase.value == 2)
        {
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

    async function goNext()
    {
        if (phase.value == 1) // Name comprobation
        {
            if (!name.value){
                showToast('error', 'You must provide your name');
                return;
            }
            else
            {
                phase.value = 2;
                showFields1.value = false;
                showFields2.value = true;
            }
            
        }
        else if (phase.value == 2) // Username and email
        {
            if (!checkEmailAndUsername())
            {
                return;
            }
            else
            {
                phase.value = 3;
                showFields2.value = false;
                showFields3.value = true;
                firstButton.value = 'Sign in';
            }
        }
        else if (phase.value == 3)
        {
            if (!checkPasswordAndRepeatPassword())
            {
                return;
            }
            else
            {
                try
                {
                    const {userCredential, userData} = await firebaseSignUp();
                    await createUserDocument(userCredential.user.uid, userData);
                    showToast('info', 'Congratulations! Your account has been created');
                    setTimeout(() => {
                        router.push('/landing');
                    }, 2000);
                }
                catch(error)
                {
                    showToast('error', error.message);
                }
                
                
            }
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

    function checkEmailAndUsername()
    {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value || !emailRegex.test(email.value))
        {
            showToast('error', 'You must provide a valid email!');
            return false;
        }
        else if (!username.value)
        {
            showToast('error', 'You must provide a valid username!');
            return false;
        }

        return true;
    }

    function checkPasswordAndRepeatPassword()
    {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

        if (!password.value || !passwordRegex.test(password.value))
        {
            showToast('error', 'You must provide a valid password!');
            return false;
        }
        else if (!repeatPassword.value)
        {
            showToast('error', 'Password confirmation is needed');
            return false; 
        }
        else if (password.value != repeatPassword.value)
        {
            showToast('error', 'Passwords do not match');
            return false;
        }

        return true;
    }

    async function firebaseSignUp() {
        try {
            const auth = getAuth();
            const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
            const user = userCredential.user;
            
            const userData = {
            uid: user.uid, 
            name: name.value,
            surname: surname.value,
            email: email.value,
            username: username.value,
            createdAt: Timestamp.now()
            };

            return { userCredential, userData };
        } 
        catch (error) {
            showToast('error', error.message);
        }
    }

    function createUserDocument (uid, userData){
        const db = getFirestore();
        const userRef = doc(db, "users", uid);
        setDoc(userRef, userData);
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

.input-group{
    display: flex;
    flex-direction: column;
    text-align: center;
    justify-content: center;
    margin-left: 20px;
    margin-right: 10px;
  }

  .column{
    flex: 1
  }
</style>
