
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
                        <form autocomplete="new-password">
                            <div class="input-fields-1" v-if="showFields1">
                            <label for="name" class="block text-900 text-xl font-medium mb-2">Name</label>
                            <div>
                                <InputText id="name" v-model="name" type="text" placeholder="Name" class="w-full md:w-30rem" style="padding: 1rem"/>
                                <span v-if="errorMessages.name" class="error-message text-red-500 block mt-2">{{ errorMessages.name }}</span>
                            </div>
                            
                            <label for="surname" class="block text-900 text-xl font-medium mb-2 mt-5">Surname</label>
                            <div>
                                <InputText id="surname" v-model="surname" type="text" placeholder="Surname" class="w-full md:w-30rem" style="padding: 1rem"/>
                            </div>
                            
                            </div>
                            <div class="input-fields-2" v-if="showFields2">
                                <label for="email" class="block text-900 text-xl font-medium mb-2">Email</label>
                                <div>
                                    <InputText id="email" v-model="email" type="text" placeholder="Email" class="w-full md:w-30rem" style="padding: 1rem"/>
                                    <span v-if="errorMessages.email" class="error-message text-red-500 block mt-2">{{ errorMessages.email }}</span>
                                </div>
                                
                                <label for="username" class="block text-900 text-xl font-medium mb-2 mt-5">Username</label>
                                <div>
                                    <InputText id="username" v-model="username" type="text" placeholder="Username" class="w-full md:w-30rem" style="padding: 1rem"/>
                                    <span v-if="errorMessages.username" class="error-message text-red-500 block mt-2">{{ errorMessages.username }}</span>
                                </div>
                                
                            </div>
                            <div class="input-fields-3" v-if="showFields3">
                                <label for="password" class="block text-900 font-medium text-xl mb-2">Password</label>
                                <div>
                                    <Password id="password" v-model="password" :feedback="true" placeholder="Password" :toggleMask="true" class="w-full md:w-30rem" inputClass="w-full" :inputStyle="{ padding: '1rem' }">
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
                                    <span v-if="errorMessages.password" class="error-message text-red-500 block mt-2">{{ errorMessages.password }}</span>
                                </div>
                            
                            <label for="confirmPassword" class="block text-900 font-medium text-xl mb-2 mt-5">Confirm password</label>
                            <div>
                                <Password id="confirmPassword" v-model="confirmPassword" :feedback="false" placeholder="Confirm password" :toggleMask="true" class="w-full" inputClass="w-full" :inputStyle="{ padding: '1rem' }"></Password>
                                <span v-if="errorMessages.confirmPassword" class="error-message text-red-500 block mt-2">{{ errorMessages.confirmPassword }}</span>
                            </div>
                            
                            </div>
                        </form>
                        
                        
                        
                        <div class="flex align-items-center justify-content-between mb-3 gap-5">
                            
                        </div>
                        <div class="flex align-items-center justify-content-center">
                            <a class="font-medium no-underline ml-2 text-center cursor-pointer mt-3" style="color: var(--primary-color)" onclick="window.location.href='/auth/login'">Already have an account? Sign in</a>
                        </div>
                        <Button :label="firstButton" class="w-full p-3 text-xl" :style="{ backgroundColor: bgColor, marginBottom: '5px', marginTop: '10px' }" @click="goNext"></Button>
                        <Button v-if="showButton" label="Back" class="w-full p-3 text-xl" :style="{ backgroundColor: bgColor }" @click="goBack"></Button> 
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
    import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, sendEmailVerification } from "firebase/auth";
    import { getFirestore, doc, setDoc, collection, where, getDocs, query } from "firebase/firestore";
    import { Timestamp } from 'firebase/firestore';
    import { toast } from 'vue3-toastify';
    import { useRouter } from 'vue-router';
    import 'vue3-toastify/dist/index.css';


    const { layoutConfig } = useLayout();

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

    const errorMessages = ref({
        name: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
    });

    const db = getFirestore();
    const userCollection = collection(db, 'users');
    const auth = getAuth();
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

    async function goNext()
    {
        if (phase.value == 1) // Name comprobation
        {
            if (!name.value){
                errorMessages.value.name = 'You must provide your name';
                return;
            }
            else
            {
                errorMessages.value.name = '';
                showButton.value = true;
                phase.value = 2;
                showFields1.value = false;
                showFields2.value = true;
            }
            
        }
        else if (phase.value == 2) // Username and email comprobation
        {
            const emailValid = await checkEmail();
            if (!emailValid)
            {
                return;
            }
            
            const usernameValid = await checkUsername();
            if (!usernameValid)
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
                    const {userCredential, userData} = await firebaseSignUp();
                    await sendEmail(userCredential, userData);
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
            "autoClose": 2000,
            "dangerouslyHTMLString": true
            })
    }

    async function checkUsername()
    {
        if (!username.value)
        {
            errorMessages.value.username = 'You must provide an username';
            return false;
        }
        else  errorMessages.value.username = '';

        const usernameExistsBool = await usernameExists();

        if (usernameExistsBool)
        {
            errorMessages.value.username = 'Username already in use';
            return false;
        } 
        else errorMessages.value.username = '';
        
        return true;
    }

    async function checkEmail()
    {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email.value || !emailRegex.test(email.value))
        {
            errorMessages.value.email = 'You must provide a valid email';
            return false;
        }
        else errorMessages.value.email = '';
        
        const emailExistsBool = await emailExists();
            
        if (emailExistsBool)
        {
            errorMessages.value.email = 'Email already in use';
            return false;
        } 
        else errorMessages.value.email = '';

        return true;
    
    }

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

    async function firebaseSignUp() {
        try {
            
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

    async function sendEmail(userCredential, userData) {
        console.log("Enviando email");
        const user = userCredential.user;

        try {
            // Email verification
            await sendEmailVerification(user);

            showToast('info', 'A verification email has been sent! Please, check your inbox');

            // Polling to check user verification status
            const intervalId = setInterval(async () => {
                await user.reload();
                if (user.emailVerified) {
                    clearInterval(intervalId); // Stop polling when user is verified
                    console.log("Verified");

                    // Create user document
                    createUserDocument(user.uid, userData);
                    showToast('info', 'Congratulations! Your account has been created');
                    setTimeout(() => {
                        router.push(`/auth/login?email=${encodeURIComponent(email)}`);
                    }, 2000);
                }
            }, 5000); // Check every 5 secs

        } catch (error) {
            console.log(error.message);
            showToast('error', error.message);
        }
    }



    
    function createUserDocument (uid, userData){
        const db = getFirestore();
        const userRef = doc(db, "users", uid);
        setDoc(userRef, userData);
    }

    async function emailExists()
    {
        try
        {
            const emailQuery = query(userCollection, where('email', '==', email.value));
            const querySnapshot = await getDocs(emailQuery);

            if (!querySnapshot.empty) {
                errorMessages.value.email = 'Email already in use';
                return true;
            }
            else
            {
                errorMessages.value.email = '';
                return false;
            } 
        }
        catch(error)
        {
            console.log(error.message);
        }
    }

    async function usernameExists()
    {
        try
        {
            const usernameQuery = query(userCollection, where('username', '==', username.value));
            const usernameQuerySnapshot = await getDocs(usernameQuery);

            if (!usernameQuerySnapshot.empty) {
                errorMessages.value.username = 'Username already in use';
                return true;
            }
            else
            {
                errorMessages.value.username = '';
                return false;
            } 
        }
        catch(error)
        {
            console.log(error.message);
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
</style>
