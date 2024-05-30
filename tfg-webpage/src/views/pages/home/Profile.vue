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
        <div class="profile-info-div flex flex-column justify-content-center align-items-center mb-3" style="">
          <h4 class="mb-1 w-full sm:mb-2" style="text-align: center;">Account info</h4>
          <div class="flex flex-column gap-2 w-full" style="max-width: 25rem;">
            <label class="lg:ml-2 font-bold" for="email">Email</label>
            <div class="input-div flex justify-content-center align-items-center w-full" style="">
              <InputText id="email" v-model="email" type="text" disabled class="w-full" style="padding: 1rem; height: 3rem;" />
              <i class="pi pi-verified ml-2" style="font-size: 2.5rem; color: gold"></i>
            </div>
          </div>
          <div class="flex flex-column gap-2 w-full mt-3" style="max-width: 25rem;">
            <label class="font-bold" for="username">Username</label>
            <div class="input-div flex justify-content-center align-items-center w-full">
              <InputText id="username" v-model="username" type="text" class="w-full" disabled style="padding: 1rem; height: 3rem;" />
              <Button icon="pi pi-pencil" @click="showModificationDialog('username')" class="p-button ml-2" style="background-color: black; height: 3rem; width: 3rem;"/>
            </div>
          </div>
          <div class="flex flex-column gap-2 w-full mt-3" style="max-width: 25rem;">
            <label class="font-bold" for="username">Password</label>
            <div class="input-div flex justify-content-center align-items-center w-full">
              <InputText id="password" v-model="password" type="text" class="w-full" placeholder="********" disabled style="padding: 1rem; height: 3rem;" />
              <Button icon="pi pi-pencil" @click="showModificationDialog('password')" class="p-button ml-2" style="background-color: black; height: 3rem; width: 3rem;"/>
            </div>
          </div>
          <Dialog v-model:visible="usernameVisible" @hide="OnDialogHide()" modal header="Edit Profile" class="md:w-30rem sm:w-25rem">
            <span class="p-text-secondary block mb-5">Update your username information.</span>
            <div class="flex align-items-center gap-3 mb-3">
              <span>Current username: <span style="font-weight: bold;">{{ originalUsername }}</span></span>
            </div>
            <div class="flex align-items-center gap-3">
                <InputText id="usernameToModify" v-model="usernameToModify" class="flex-auto" style="height: 3rem;" autocomplete="off" placeholder="New username"/>
            </div>
            <span v-if="errorMessages.username" class="error-message text-red-500 block mt-1" style="font-size: 13px;">{{ errorMessages.username }}</span>
            <div class="flex justify-content-center gap-5 mt-5">
                <Button type="button" label="Cancel" severity="secondary" @click="OnDialogHide()"></Button>
                <Button type="button" label="Save" @click="checkNewUsername()"></Button>
            </div>
          </Dialog>
          <Dialog v-model:visible="passwordVisible" @hide="OnDialogHide()" modal header="Edit Profile" class="md:w-30rem sm:w-25rem">
              <span class="p-text-secondary block mb-5">Update your profile information.</span>
              
              <div class="flex align-items-center gap-3">
                  <Password id="currentPassword" v-model="currentPassword" inputClass="w-full" :feedback="false" :toggleMask="true" class="w-full" style="width: 100%; height: 3rem;" autocomplete="off" placeholder="Current password"/>
              </div>
              <span v-if="errorMessages.currentPassword" class="error-message text-red-500 block mt-1" style="font-size: 13px;">{{ errorMessages.currentPassword }}</span>
              
              <div class="flex align-items-center gap-3 mt-3">
                <Password id="newPassword" v-model="newPassword" inputClass="w-full" :feedback="false" :toggleMask="true" class="w-full" style="width: 100%; height: 3rem;" autocomplete="off" placeholder="New password"/>
              </div>
              <span v-if="errorMessages.newPassword" class="error-message text-red-500 block mt-1" style="font-size: 13px;">{{ errorMessages.newPassword }}</span>
              
              <div class="flex align-items-center gap-3 mt-3">
                <Password id="confirmNewPassword" v-model="confirmNewPassword" inputClass="w-full" :feedback="false" :toggleMask="true" class="w-full" style="width: 100%; height: 3rem;" autocomplete="off" placeholder="Confirm new password"/>
              </div>
              <span v-if="errorMessages.confirmNewPassword" class="error-message text-red-500 block mt-1" style="font-size: 13px;">{{ errorMessages.confirmNewPassword }}</span>
              <div class="flex justify-content-center gap-5 mt-5">
                  <Button type="button" label="Cancel" severity="secondary" @click="OnDialogHide()"></Button>
                  <Button type="button" label="Save" @click="checkPasswordInputs()"></Button>
              </div>
          </Dialog>
          <h4 class="mb-1 w-full sm:mb-2 mt-6" style="text-align: center;">Personal info</h4>
          <div class="flex flex-column gap-2 w-full" style="max-width: 25rem;">
            <label class="font-bold" for="name">Name</label>
            <div class="input-div flex flex-column justify-content-center align-items-center w-full">
              <InputText id="name" v-model="name" type="text" class="w-full" style="padding: 1rem; height: 3rem;" />
            </div>
            <span v-if="errorMessages.name" class="error-message text-red-500 block">{{ errorMessages.name }}</span>
          </div>
          <div class="flex flex-column gap-2 w-full mt-3" style="max-width: 25rem;">
            <label class="font-bold" for="surname">Surname</label>
            <div class="input-div flex justify-content-center align-items-center w-full" style="">
              <InputText id="surname" v-model="surname" type="text" class="w-full" style="padding: 1rem; height: 3rem;" />
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
import { ref, watch, onMounted } from 'vue';
import { useUserInfoStore, useAuthStore } from '@/stores';
import { useConfirm } from 'primevue/useconfirm';

import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';


const userInfoStore = useUserInfoStore();
const authStore = useAuthStore();
const confirm = useConfirm();

const usernameVisible = ref(false);
const passwordVisible = ref(false);

const originalName = ref('')
const originalSurname = ref('')
const originalUsername = ref('')
const originalEmail = ref('')

const usernameToModify = ref('');
const currentPassword = ref('');
const newPassword = ref('');
const confirmNewPassword = ref('');

const username = ref(userInfoStore.username);
const email = ref(userInfoStore.email);
const name = ref(userInfoStore.name);
const surname = ref(userInfoStore.surname);
const password = ref('********');

const isSaveButtonEnabled = ref(false);
const loading = ref(false);

const errorMessages = ref({
        name: '',
        username: '',
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });

let usernameIsValid = ref(false);
let nameIsValid = ref(false);
let currentPasswordIsValid = ref(false);
let newPasswordIsValid = ref(false);
let confirmNewPasswordIsValid = ref(false);

onMounted(() => {
  originalUsername.value = username.value;
  originalEmail.value = email.value;
  originalName.value = name.value;
  originalSurname.value = surname.value;
});

watch([username, name, surname], ([newUsername, newName, newSurname]) => {
  isSaveButtonEnabled.value = (
    newUsername !== originalUsername.value ||
    newName !== originalName.value ||
    newSurname !== originalSurname.value
  );
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

async function savePersonalInfo() {
  loading.value = true;
  await userInfoStore.updatePersonalInfo(name.value, surname.value);
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
    accept: savePersonalInfo,
    reject: () => window.location.reload(),
  });
}

function showModificationDialog(field) {
 
  if (field == 'username')
  {
     usernameVisible.value = true;
  } 
  else
  {
    passwordVisible.value = true;
  } 
}

async function checkNewUsername()
{
  if (usernameToModify.value != originalUsername.value) {
    const [usernameError, usernameValid] = await userInfoStore.checkUsername(usernameToModify.value);
    errorMessages.value.username = usernameError;
    usernameIsValid.value = usernameValid;
    if (usernameIsValid.value) {
      await userInfoStore.updateUsername(usernameToModify.value);
      window.location.reload();
    }
  }
  else
  {
    errorMessages.value.username = 'Your new username must be different from your current one';
    return;
  }
  }

async function checkPasswordInputs()
{
  // We first check if the current password is correct
  if (!currentPassword.value)
  {
    errorMessages.value.currentPassword = 'You must provide your current password';
    return;
  }
  
  [errorMessages.value.currentPassword, currentPasswordIsValid] = await authStore.checkCurrentPassword(currentPassword.value);
  if (!currentPasswordIsValid) 
  {
    return;
  }
  else
  {
    if (checkPasswordAndConfirmPassword())
    {
      await authStore.changePassword(newPassword.value);
      showToast('info', 'Password successfully updated');
      setTimeout(() => {
                      window.location.reload();
                    }, 2000);
    }
  }
}

function checkPasswordAndConfirmPassword()
{
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  if (!newPassword.value || !passwordRegex.test(newPassword.value))
  {
      errorMessages.value.newPassword = 'Insecure password, please try again';
      return false;
  }
  else errorMessages.value.newPassword = '';

  if (!confirmNewPassword.value)
  {
      errorMessages.value.confirmNewPassword = 'Password confirmation is needed';
      return false; 
  }
  else if (newPassword.value != confirmNewPassword.value)
  {
      errorMessages.value.confirmNewPassword = 'Passwords do not match';
      return false;
  }
  else errorMessages.value.confirmNewPassword = '';
  
  return true;
}

function OnDialogHide()
{
  usernameVisible.value = false;
  passwordVisible.value = false;
  errorMessages.value.username = '';
  errorMessages.value.currentPassword = '';
  errorMessages.value.password = '';
  errorMessages.value.confirmPassword = '';
  usernameToModify.value = '';
  currentPassword.value = '';
  newPassword.value = '';
  confirmNewPassword.value = '';
}

async function makeComprobations() {
  let allValid = true;

  if (name.value !== originalName.value) {
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

