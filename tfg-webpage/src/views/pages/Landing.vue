
<script setup>
import { computed, onMounted } from 'vue';

import { useLayout } from '@/layout/composables/layout';
import AppConfig from '@/layout/AppConfig.vue';

import { useAuthStore } from '@/stores';
import Sidebar from 'primevue/sidebar';
import { ref } from 'vue';

const { layoutConfig } = useLayout();
const authStore = useAuthStore();


const smoothScroll = (id) => {
    document.querySelector(id).scrollIntoView({
        behavior: 'smooth'
    });
};

const bgColor = computed(() => {
        return layoutConfig.darkTheme.value ? 'white' : 'black';
})
const logoUrl = computed(() => {
    return `layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
});

const showTopBar = ref(false);

function toggleTopBar() {
    showTopBar.value = !showTopBar.value;
}

function logout() {
    authStore.logout();
    window.location.reload();
}

</script>

<template>
    <div 
    class="surface-0 flex justify-content-center"
    >
        <div id="navBar" class="landing-wrapper overflow-hidden">
            <div class="py-4 px-4 mx-0 md:mx-6 lg:mx-8 lg:px-8 flex align-items-center justify-content-between relative lg:static mb-3">
                <a class="flex align-items-center" href="#">  </a>
                <a class="flex align-items-center" href="#"> <img src="../../assets/images/Logo-nobg.png" alt="Logo" height="100" class="mr-0 lg:mr-2" /> </a>
                <a class="cursor-pointer block lg:hidden text-700 p-ripple" v-ripple v-styleclass="{ selector: '@next', enterClass: 'hidden', leaveToClass: 'hidden', hideOnOutsideClick: true }">
                    <i class="pi pi-bars text-4xl"></i>
                </a>
                <div class="align-items-center surface-0 flex-grow-1 justify-content-between hidden lg:flex absolute lg:static w-full left-0 px-6 lg:px-0 z-2" style="top: 120px">
                    <ul class="list-none p-0 m-0 flex lg:align-items-center select-none flex-column lg:flex-row cursor-pointer text-black" style="color: black;">
                        <li>
                            <a @click="smoothScroll('#hero')" class="flex m-0 md:ml-5 px-0 py-3 text-2xl font-medium line-height-3 p-ripple" v-ripple>
                                <span>Home</span>
                            </a>
                        </li>
                        <li>
                            <a @click="smoothScroll('#armory')" class="flex m-0 md:ml-5 px-0 py-3 text-2xl font-medium line-height-3 p-ripple" v-ripple>
                                <span>Armory</span>
                            </a>
                        </li>
                        <li>
                            <a @click="smoothScroll('#news')" class="flex m-0 md:ml-5 px-0 py-3 text-2xl font-medium line-height-3 p-ripple" v-ripple>
                                <span>News</span>
                            </a>
                        </li>
                        <li>
                            <a @click="smoothScroll('#about-me')" class="flex m-0 md:ml-5 px-0 py-3 text-2xl font-medium line-height-3 p-ripple" v-ripple>
                                <span>About Me</span>
                            </a>
                        </li>
                    </ul>
                    <div class="layout-topbar-menu flex justify-content-center lg:block border-top-1 lg:border-top-none surface-border py-3 lg:py-0 mt-3 lg:mt-0">
                        <button @click="toggleTopBar()" class="p-link layout-topbar-button flex align-items-center justify-content-center" style="flex-direction: column;">
                            <i class="pi pi-user text-5xl mb-1"></i>
                            <span class="text-2xl font-medium text-black">Account</span>
                        </button>
                    </div>
                </div>
            </div>

            <Sidebar v-model:visible="showTopBar" position="top" style="height: auto;">
                <div v-if="!authStore.isAuthenticated" class="button-container flex justify-content-center" style="gap: 6.5rem;">
                    <router-link to="/auth/login">
                        <div class="flex align-items-center justify-content-center" style="flex-direction: column;">
                            <div class="flex align-items-center justify-content-center" style="width: 3.5rem; height: 3.5rem; border-radius: 10px; background-color: black;">
                                <i class="pi pi-fw pi-sign-in text-5xl" style="color: white;"></i>
                            </div>
                            <h5 style="margin-top: 0.7rem; margin-bottom: 0;">Sign in</h5>
                        </div>
                    </router-link>
                    <router-link to="/auth/register">
                        <div class="flex align-items-center justify-content-center" style="flex-direction: column;">
                            <div class="flex align-items-center justify-content-center" style="width: 3.5rem; height: 3.5rem; border-radius: 10px; background-color: black;">
                                <i class="pi pi-fw pi-user-plus text-5xl" style="color: white;"></i>
                            </div>
                            <h5 style="margin-top: 0.7rem; margin-bottom: 0;">Register</h5>
                        </div>
                    </router-link>
                </div>

                <div v-if="authStore.isAuthenticated" class="button-container flex justify-content-center" style="gap: 6.5rem;">
                    <router-link to="/home/dashboard">
                        <div class="flex align-items-center justify-content-center" style="flex-direction: column;">
                            <div class="flex align-items-center justify-content-center" style="width: 3.5rem; height: 3.5rem; border-radius: 10px; background-color: black;">
                                <i class="pi pi-fw pi-home text-5xl" style="color: white;"></i>
                            </div>
                            <h5 style="margin-top: 0.7rem; margin-bottom: 0;">Home</h5>
                        </div>
                    </router-link>
                    <a @click="logout()" style="cursor: pointer;">
                        <div class="flex align-items-center justify-content-center" style="flex-direction: column;">
                            <div class="flex align-items-center justify-content-center" style="width: 3.5rem; height: 3.5rem; border-radius: 10px; background-color: black;">
                                <i class="pi pi-fw pi-sign-out text-5xl" style="color: white;"></i>
                            </div>
                            <h5 style="margin-top: 0.7rem; margin-bottom: 0;">Sign out</h5>
                        </div>
                    </a>
                </div>
            </Sidebar>

            <div
                id="hero"
                class="flex flex-column pt-4 px-4 lg:px-8 overflow-hidden"
                style="background: linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)),radial-gradient(77.36% 256.97% at 77.36% 57.52%, rgb(196, 196, 196) 0%, rgb(85, 85, 85) 100%), radial-gradient(77.36% 256.97% at 77.36% 57.52%, rgb(238, 239, 175) 0%, rgb(195, 227, 250) 100%); clip-path: ellipse(150% 87% at 93% 13%);"
            
            >
            <div class="mx-4 md:mx-8 mt-0 md:mt-4 flex">
                <div>
                    <h1 class="text-6xl font-bold text-black line-height-2">Recover from the shadows of your mind...</h1>
                    <p class="font-normal text-2xl line-height-3 md:mt-3 text-gray-800">You have woken up but your mind is... different. <br> It feels like your thoughts and memories have been stolen or even <strong>erased</strong></p>
                    <br>
                    <Button label="PLAY NOW FOR FREE!" :style="{ 'background-color': 'black', 'margin-left': 'irem' }" class="p-button-rounded text-xl border-none mt-5 bg-black font-normal text-white line-height-3 px-3 md:ml-0"></Button>
                    </div>
                </div>
                    <div class="flex justify-content-center md:justify-content-end">
                        <div class ="hidden md:flex md:w-5 md:h-7" style="width: 700px; height: 400px; border: 5px solid black; margin-top: 100px">
                            <iframe style="width: 100%; height: 100%;" src="https://www.youtube.com/embed/_zDZYrIUgKE?si=FftuGB7GEEjFGVeh" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                        </div>
                        <img src="/src/assets/images/ninja.png" alt="Hero Image" class="w-10 md:w-auto" />
                    </div>
                </div>

            <div 
                id="armory" 
                class="py-4 px-4 lg:px-8 mt-5 mx-0 lg:mx-8"
                >
                <div class="grid justify-content-center">
                    <div
                        class="col-12 mt-8 mb-8 p-2 md:p-5 justify-content-center align-items-center text-center"
                        style="border-radius: 20px; background: linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), radial-gradient(77.36% 256.97% at 77.36% 57.52%, rgb(211, 211, 211) 0%, rgb(128, 128, 128) 100%), radial-gradient(77.36% 256.97% at 77.36% 57.52%, rgb(221, 221, 153) 0%, rgb(192, 212, 230) 100%);">
                        <h1 class="text-black font-bold"> Armory</h1>
                        <span class="text-600 text-2xl">Learn about weapons and skills!</span>
                    </div>
                        
                    

                    <div class="col-12 md:col-12 lg:col-4 p-0 lg:pr-5 lg:pb-5 mt-4 lg:mt-0">
                        <div class="armory-div">
                            <div class="p-3 surface-card h-full" style="border-radius: 8px">
                                <div class="flex align-items-center justify-content-center bg-yellow-200 mb-3" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                                    <i class="pi pi-fw pi-users text-2xl text-yellow-700"></i>
                                </div>
                                <h5 class="mb-2 text-900">Teleport</h5>
                                <span class="text-600">Cross the battlefield in the blink of an eye <br><br> Power cost: 35</span>
                            </div>
                        </div>
                    </div>

                    <div class="col-12 md:col-12 lg:col-4 p-0 lg:pr-5 lg:pb-5 mt-4 lg:mt-0">
                        <div class="armory-div">
                            <div class="p-3 surface-card h-full" style="border-radius: 8px">
                                <div class="flex align-items-center justify-content-center bg-cyan-200 mb-3" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                                    <i class="pi pi-fw pi-palette text-2xl text-cyan-700"></i>
                                </div>
                                <h5 class="mb-2 text-900">Invisibility</h5>
                                <span class="text-600">Don't let your enemies see you<br><br> Power cost: 25</span>
                            </div>
                        </div>
                    </div>

                    <div class="col-12 md:col-12 lg:col-4 p-0 lg:pb-5 mt-4 lg:mt-0">
                        <div class="armory-div">
                            <div class="p-3 surface-card h-full" style="border-radius: 8px">
                                <div class="flex align-items-center justify-content-center bg-indigo-200" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                                    <i class="pi pi-fw pi-map text-2xl text-indigo-700"></i>
                                </div>
                                <h5 class="mb-2 text-900">Dash</h5>
                                <span class="text-600">Avoid enemy attacks and reach new heights<br><br> Power cost: 25</span>
                            </div>
                        </div>
                    </div>

                    <div class="col-12 md:col-12 lg:col-4 p-0 lg:pr-5 lg:pb-5 mt-4 lg:mt-0">
                        <div class="armory-div">
                            <div class="p-3 surface-card h-full" style="border-radius: 8px">
                                <div class="flex align-items-center justify-content-center bg-bluegray-200 mb-3" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                                    <i class="pi pi-fw pi-id-card text-2xl text-bluegray-700"></i>
                                </div>
                                <h5 class="mb-2 text-900">Pistol</h5>
                                <span class="text-600">A light and quick weapon<br><br> 
                                    Damage: 25<br>
                                    Mag size: 11<br>
                                    Implemented: not yet<br>
                                    </span>
                            </div>
                        </div>
                    </div>

                    <div class="col-12 md:col-12 lg:col-4 p-0 lg:pr-5 lg:pb-5 mt-4 lg:mt-0">
                        <div class="armory-div">
                            <div class="p-3 surface-card h-full" style="border-radius: 8px">
                                <div class="flex align-items-center justify-content-center bg-orange-200 mb-3" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                                    <i class="pi pi-fw pi-star text-2xl text-orange-700"></i>
                                </div>
                                <h5 class="mb-2 text-900">SMG</h5>
                                <span class="text-600">Medium firepower and great movement<br><br> 
                                    Damage: 15<br>
                                    Mag size: 27<br>
                                    Implemented: not yet<br></span>
                            </div>
                        </div>
                    </div>

                    <div class="col-12 md:col-12 lg:col-4 p-0 lg:pb-5 mt-4 lg:mt-0">
                        <div class="armory-div">
                            <div class="p-3 surface-card h-full" style="border-radius: 8px">
                                <div class="flex align-items-center justify-content-center bg-pink-200 mb-3" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                                    <i class="pi pi-fw pi-moon text-2xl text-pink-700"></i>
                                </div>
                                <h5 class="mb-2 text-900">Rifle</h5>
                                <span class="text-600">Hight firepower but slower movement<br><br> 
                                    Damage: 40<br>
                                    Mag size: 30<br>
                                    Implemented: not yet<br></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="news" class="py-4 px-4 lg:px-8 mx-0 my-6 lg:mx-8">
                <div
                    class="col-12 mt-8 mb-8 p-2 md:p-5 justify-content-center align-items-center text-center"
                    style="border-radius: 20px; background: linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), radial-gradient(77.36% 256.97% at 77.36% 57.52%, rgb(211, 211, 211) 0%, rgb(128, 128, 128) 100%), radial-gradient(77.36% 256.97% at 77.36% 57.52%, rgb(221, 221, 153) 0%, rgb(192, 212, 230) 100%);">
                    <h1 class="text-black font-bold"> News</h1>
                    <span class="text-600 text-2xl">Stay up to the latest news</span>
                </div>

                <div class="grid mt-8 pb-2 md:pb-8">
                    <div class="flex justify-content-center col-12 lg:col-6 bg-purple-100 p-0 flex-order-1 lg:flex-order-0" style="border-radius: 8px">
                        <img src="/demo/images/landing/mockup.svg" class="w-11" alt="mockup mobile" />
                    </div>

                    <div class="col-12 lg:col-6 my-auto flex flex-column lg:align-items-end text-center lg:text-right">
                        <div class="flex align-items-center justify-content-center bg-purple-200 align-self-center lg:align-self-end" style="width: 4.2rem; height: 4.2rem; border-radius: 10px">
                            <i class="pi pi-fw pi-mobile text-5xl text-purple-700"></i>
                        </div>
                        <h2 class="line-height-1 text-900 text-4xl font-normal">New weapon added!</h2>
                        <span class="text-700 text-2xl line-height-3 ml-0 md:ml-2" style="max-width: 650px"
                            >Lectus arcu bibendum at varius vel pharetra vel turpis nunc. Eget aliquet nibh praesent tristique magna sit amet purus gravida. Sit amet mattis vulputate enim nulla aliquet.</span
                        >
                    </div>
                </div>

                <div class="grid my-8 pt-2 md:pt-8">
                    <div class="col-12 lg:col-6 my-auto flex flex-column text-center lg:text-left lg:align-items-start">
                        <div class="flex align-items-center justify-content-center bg-yellow-200 align-self-center lg:align-self-start" style="width: 4.2rem; height: 4.2rem; border-radius: 10px">
                            <i class="pi pi-fw pi-desktop text-5xl text-yellow-700"></i>
                        </div>
                        <h2 class="line-height-1 text-900 text-4xl font-normal">New skill added!</h2>
                        <span class="text-700 text-2xl line-height-3 mr-0 md:mr-2" style="max-width: 650px"
                            >Adipiscing commodo elit at imperdiet dui. Viverra nibh cras pulvinar mattis nunc sed blandit libero. Suspendisse in est ante in. Mauris pharetra et ultrices neque ornare aenean euismod elementum nisi.</span
                        >
                    </div>

                    <div class="flex justify-content-end flex-order-1 sm:flex-order-2 col-12 lg:col-6 bg-yellow-100 p-0" style="border-radius: 8px">
                        <img src="/demo/images/landing/mockup-desktop.svg" class="w-11" alt="mockup" />
                    </div>
                </div>
            </div>

            <div id="about-me" class="py-4 px-4 lg:px-8 mt-5 mx-0 lg:mx-8">
                <div
                    class="col-12 mt-8 mb-5 p-2 md:p-5 justify-content-center align-items-center text-center"
                    style="border-radius: 20px; background: linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), radial-gradient(77.36% 256.97% at 77.36% 57.52%, rgb(211, 211, 211) 0%, rgb(128, 128, 128) 100%), radial-gradient(77.36% 256.97% at 77.36% 57.52%, rgb(221, 221, 153) 0%, rgb(192, 212, 230) 100%);">
                    <h1 class="text-black font-bold"> About me</h1>
                    <span class="text-600 text-2xl">Learn about me!</span>
                </div>
                <div class="flex flex-column lg:align-items-center text-center lg:text-center">
                    <h3 class="line-height-1 text-900 text-2xl font-normal">
                        Hi! I'm Mario, the main developer of Erased Memories. This is my final degree work.
                        <br>
                        I'm currently studying Computer Engineering at the University of Salamanca.
                        <br>
                        I love videogames and I've always wanted to create one. This is my first project and I hope you enjoy it!
                    </h3>
                    
                </div>
            </div>

            <div class="py-4 px-4 mx-0 mt-5 lg:mx-8">
                <a @click="smoothScroll('#navBar')" class="flex flex-wrap align-items-center justify-content-center md:justify-content-center md:mb-5 mb-3 cursor-pointer">
                        <img src="../../assets/images/Logo-nobg.png" alt="footer sections"height="120" class="mr-2" />
                </a>
                <div class="grid justify-content-center">
                    <div class="col-12 md:col-10 lg:col-7">
                        <div class="grid text-center md:text-left">
                            <div class="col-12 md:col-3">
                                <h4 class="font-medium text-2xl line-height-3 mb-3 text-900">Company</h4>
                                <a class="line-height-3 text-xl block cursor-pointer mb-2 text-700">About Us</a>
                                <a class="line-height-3 text-xl block cursor-pointer mb-2 text-700">News</a>
                                <a class="line-height-3 text-xl block cursor-pointer mb-2 text-700">Investor Relations</a>
                                <a class="line-height-3 text-xl block cursor-pointer mb-2 text-700">Careers</a>
                                <a class="line-height-3 text-xl block cursor-pointer text-700">Media Kit</a>
                            </div>

                            <div class="col-12 md:col-3 mt-4 md:mt-0">
                                <h4 class="font-medium text-2xl line-height-3 mb-3 text-900">Resources</h4>
                                <a class="line-height-3 text-xl block cursor-pointer mb-2 text-700">Get Started</a>
                                <a class="line-height-3 text-xl block cursor-pointer mb-2 text-700">Learn</a>
                                <a class="line-height-3 text-xl block cursor-pointer text-700">Case Studies</a>
                            </div>

                            <div class="col-12 md:col-3 mt-4 md:mt-0">
                                <h4 class="font-medium text-2xl line-height-3 mb-3 text-900">Community</h4>
                                <a class="line-height-3 text-xl block cursor-pointer mb-2 text-700">Discord</a>
                                <a class="line-height-3 text-xl block cursor-pointer mb-2 text-700">Events<img src="/demo/images/landing/new-badge.svg" class="ml-2" /></a>
                                <a class="line-height-3 text-xl block cursor-pointer mb-2 text-700">FAQ</a>
                                <a class="line-height-3 text-xl block cursor-pointer text-700">Blog</a>
                            </div>

                            <div class="col-12 md:col-3 mt-4 md:mt-0">
                                <h4 class="font-medium text-2xl line-height-3 mb-3 text-900">Legal</h4>
                                <a class="line-height-3 text-xl block cursor-pointer mb-2 text-700">Brand Policy</a>
                                <a class="line-height-3 text-xl block cursor-pointer mb-2 text-700">Privacy Policy</a>
                                <a class="line-height-3 text-xl block cursor-pointer text-700">Terms of Service</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <AppConfig simple />
</template>


<style scoped>
.armory-div {
    height: 230px;
    padding: 2px;
    border-radius: 10px;
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), radial-gradient(77.36% 256.97% at 77.36% 57.52%, rgb(128, 128, 128) 0%, rgb(211, 211, 211) 100%), radial-gradient(77.36% 256.97% at 77.36% 57.52%, rgb(85, 85, 85) 0%, rgb(211, 211, 211) 100%);
    transition: transform 0.3s ease; /* Define la transición fuera de :hover */
}

.armory-div:hover {
    transform: scale(1.05); /* Define la transformación solo en :hover */
}
</style> 


