<template>
  <div class="profile-container flex justify-content-center mb-5">
    <Card style="width: 50rem; overflow: hidden">
      <template #header>
        <div class="profile-div flex justify-content-center align-items-center w-full mt-3 mb-3" style=" flex-direction: column;">
          <div class="profile-img-div mb-3" style=" border-radius: 50%; width: 200px; height: 200px;">
            <img :src="userInfoStore.profileImg" alt="ProfileImg" class="profile-img" style="object-fit: cover; border-radius: 50%; width: 100%; height: 100%;" />
          </div>
          <button class="p-button" @click="openFileInput" style="background-color: black; color: white; padding: 10px 20px; border: none; cursor: pointer;">Choose Image</button>
          <input type="file" style="display: none;" ref="fileInput" @change="onFileChange" accept="image/*">
        </div>
      </template>

      <template #content>
        <div class="profile-info-div flex flex-column justify-content-center align-items-center mb-3">
          <h4 class="mb-1 w-full" style="text-align: center;">Account info</h4>
          <div class="flex flex-column gap-2">
            <label for="username">Username</label>
            <div class="input-div flex justify-content-center align-items-center lg:mr-3 mb-3" >
              <InputText id="username" v-model="username" type="text" :disabled="usernameFieldDisabled" class="w-full md:w-30rem mr-3" style="padding: 1rem; height: 4rem;" />
              <Button icon="pi pi-pencil" @click="enableField('username')" class="p-button" style="background-color: black; height: 4rem; width: 4rem;"/>
            </div> 
          </div>
          <div class="flex flex-column gap-2">
            <label for="email">Email</label>
            <div class="input-div flex justify-content-center align-items-center lg:mr-3 mb-5" style="">
              <InputText id="email" v-model="email" type="text" :disabled="emailFieldDisabled" class="w-full md:w-30rem mr-3" style="padding: 1rem; height: 4rem;" />
              <Button icon="pi pi-pencil" @click="enableField('email')" class="p-button" style="background-color: black; height: 4rem; width: 4rem;"/>
            </div> 
          </div>
          <h4 class="mb-1 w-full" style="text-align: center;">Personal info</h4>
          <div class="flex flex-column gap-2">
            <label for="name">Name</label>
            <div class="input-div flex justify-content-center align-items-center lg:mr-3 mb-3">
              <InputText id="name" v-model="name" type="text" :disabled="nameFieldDisabled" class="w-full md:w-30rem mr-3" style="padding: 1rem; height: 4rem;" />
              <Button icon="pi pi-pencil" @click="enableField('name')" class="p-button" style="background-color: black; height: 4rem; width: 4rem;"/>
            </div> 
          </div>
          <div class="flex flex-column gap-2">
            <label for="surname">Surname</label>
            <div class="input-div flex justify-content-center align-items-center lg:mr-3 mb-3" style="">
              <InputText id="email" v-model="surname" type="text" :disabled="surnameFieldDisabled" class="w-full md:w-30rem mr-3" style="padding: 1rem; height: 4rem;" />
              <Button icon="pi pi-pencil" @click="enableField('surname')" class="p-button" style="background-color: black; height: 4rem; width: 4rem;"/>
            </div> 
          </div>    
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useUserInfoStore } from '../../../stores/userInfo.store';

const userInfoStore = useUserInfoStore();

const usernameFieldDisabled = ref(true);
const emailFieldDisabled = ref(true);
const nameFieldDisabled = ref(true);
const surnameFieldDisabled = ref(true);

const username = ref(userInfoStore.username);
const email = ref(userInfoStore.email);
const name = ref(userInfoStore.name);
const surname = ref(userInfoStore.surname);

function onFileChange(event) {
  const file = event.target.files[0];
  if (file) {
    userInfoStore.updateProfileImg(file); // Llamar al método para actualizar la imagen de perfil
  }
}

function openFileInput() {
  const fileInput = document.querySelector('input[type="file"]');
  if (fileInput) {
    fileInput.click();
  }
}

function enableField(field) {
  switch (field) {
    case 'username':
      usernameFieldDisabled.value = false;
      break;
    case 'email':
      emailFieldDisabled.value = false;
      break;
    case 'name':
      nameFieldDisabled.value = false;
      break;
    case 'surname':
      surnameFieldDisabled.value = false;
      break;
    default:
      break;
  }
}
</script>

