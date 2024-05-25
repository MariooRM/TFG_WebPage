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
          <h4 class="mb-1 w-full sm:mb-3" style="text-align: center;">Account info</h4>
          <div class="flex flex-column gap-2">
            <label for="username">Username</label>
            <div class="input-div flex justify-content-center align-items-center lg:mr-3" >
              <InputText id="username" v-model="username" type="text" :disabled="usernameFieldDisabled" class="w-full md:w-30rem mr-3" style="padding: 1rem; height: 3rem;" />
              <Button icon="pi pi-pencil" @click="enableField('username')" class="p-button" style="background-color: black; height: 3rem; width: 3rem;"/>
            </div> 
            <span v-if="errorMessages.username" class="error-message text-red-500 block">{{ errorMessages.username }}</span>
          </div>
          <div class="flex flex-column gap-2 mt-3">
            <label for="email">Email</label>
            <div class="input-div flex justify-content-center align-items-center lg:mr-3" style="">
              <InputText id="email" v-model="email" type="text" :disabled="emailFieldDisabled" class="w-full md:w-30rem mr-3" style="padding: 1rem; height: 3rem;" />
              <Button icon="pi pi-pencil" @click="enableField('email')" class="p-button" style="background-color: black; height: 3rem; width: 3rem;"/>
            </div> 
            <span v-if="errorMessages.email" class="error-message text-red-500 block">{{ errorMessages.email }}</span>
          </div>
          <h4 class="mb-1 w-full sm:mb-3 mt-5" style="text-align: center;">Personal info</h4>
          <div class="flex flex-column gap-2">
            <label for="name">Name</label>
            <div class="input-div flex justify-content-center align-items-center lg:mr-3 mb-3">
              <InputText id="name" v-model="name" type="text" :disabled="nameFieldDisabled" class="w-full md:w-30rem mr-3" style="padding: 1rem; height: 3rem;" />
              <span v-if="errorMessages.name" class="error-message text-red-500 block mt-2">{{ errorMessages.name }}</span>
              <Button icon="pi pi-pencil" @click="enableField('name')" class="p-button" style="background-color: black; height: 3rem; width: 3rem;"/>
            </div> 
          </div>
          <div class="flex flex-column gap-2">
            <label for="surname">Surname</label>
            <div class="input-div flex justify-content-center align-items-center lg:mr-3 mb-3" style="">
              <InputText id="email" v-model="surname" type="text" :disabled="surnameFieldDisabled" class="w-full md:w-30rem mr-3" style="padding: 1rem; height: 3rem;" />
              <Button icon="pi pi-pencil" @click="enableField('surname')" class="p-button" style="background-color: black; height: 3rem; width: 3rem;"/>
            </div> 
          </div>  
        </div>
        
      </template>
      <template #footer>
        <ConfirmDialog group="headless">
            <template #container="{ message, acceptCallback, rejectCallback }">
                <div class="flex flex-column align-items-center p-5 surface-overlay border-round">
                    <div class="border-circle bg-primary inline-flex justify-content-center align-items-center h-6rem w-6rem -mt-8">
                        <i class="pi pi-exclamation-circle text-5xl"></i>
                    </div>
                    <span class="font-bold text-2xl block mb-2 mt-4">{{ message.header }}</span>
                    <p class="mb-0">{{ message.message }}</p>
                    <div class="flex align-items-center gap-2 mt-4">
                        <Button label="Confirm" @click="acceptCallback"></Button>
                        <Button label="Cancel" outlined @click="rejectCallback"></Button>
                    </div>
                </div>
            </template>
        </ConfirmDialog>
        <div class="flex justify-content-center align-items center">
          <Button class="md:w-3 sm:w-3 p-3" style="height: 50px;" @click="makeComprobations()" type="button" :disabled="!isSaveButtonEnabled" label="Save changes" icon="pi pi-save" :loading="loading"/>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useUserInfoStore } from '@/stores';
import { useConfirm } from 'primevue/useconfirm';

const userInfoStore = useUserInfoStore();
const confirm = useConfirm();

const usernameFieldDisabled = ref(true);
const emailFieldDisabled = ref(true);
const nameFieldDisabled = ref(true);
const surnameFieldDisabled = ref(true);

const username = ref(userInfoStore.username);
const email = ref(userInfoStore.email);
const name = ref(userInfoStore.name);
const surname = ref(userInfoStore.surname);

const isSaveButtonEnabled = ref(false);
const loading = ref(false);

const errorMessages = ref({
        name: '',
        email: '',
        username: '',
    });

const emailIsValid = ref(false);
const usernameIsValid = ref(false);
const nameIsValid = ref(false);

watch([username, email, name, surname], () => {
  isSaveButtonEnabled.value = true;
});

function onFileChange(event) {
  const file = event.target.files[0];
  if (file) {
    userInfoStore.updateProfileImg(file); 
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

async function saveChanges() {
  loading.value = true;
  await userInfoStore.updateUserInfo(username.value, email.value, name.value, surname.value);
  setTimeout(() => {
    loading.value = false;
    window.location.reload();
  }, 1000);
}

function showConfirmDialog() {
  confirm.require({
    group: 'headless',
    message: 'Are you sure you want to save changes?',
    header: 'Confirmation',
    accept: saveChanges,
    reject: () => window.location.reload(),
  });
}

async function makeComprobations() {
  let allValid = true;

  if (!usernameFieldDisabled.value) {
    const [usernameError, usernameValid] = await userInfoStore.checkUsername(username.value);
    errorMessages.value.username = usernameError;
    usernameIsValid.value = usernameValid;
    if (!usernameIsValid.value) {
      allValid = false;
    } 
  }

  if (!emailFieldDisabled.value) {
    const [emailError, emailValid] = await userInfoStore.checkEmail(email.value);
    errorMessages.value.email = emailError;
    emailIsValid.value = emailValid;
    if (!emailIsValid.value) {
      allValid = false;
    }
  }

  if (!nameFieldDisabled.value) {
    const [nameError, nameValid] = userInfoStore.checkName(name.value);
    errorMessages.value.name = nameError;
    nameIsValid.value = nameValid;
    if (!nameIsValid.value) {
      allValid = false;
    }
  }

  if (allValid) {
    showConfirmDialog();
  }
}
</script>

