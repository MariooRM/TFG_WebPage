<template>
  <div class="profile-container flex justify-content-center">
    <Card style="width: 100rem; overflow: hidden">
      <template #header>
        <div class="profile-div flex justify-content-center align-items-center w-full mt-3 mb-3" style="border: 1px solid black; flex-direction: column;">
          <div class="profile-img-div mb-2" style="border: 1px solid black; border-radius: 50%; width: 200px; height: 200px;">
            <img :src="profileImageUrl" alt="ProfileImg" class="profile-img" style="object-fit: cover; border-radius: 50%; width: 100%; height: 100%;" />
          </div>
          <button class="p-button" @click="openFileInput" style="background-color: black; color: white; padding: 10px 20px; border: none; cursor: pointer;">Choose Image</button>
          <input type="file" style="display: none;" ref="fileInput" @change="onFileChange" accept="image/*">
        </div>
      </template>

      <template #content>
        <div class="info-div grid flex justify-content-center align-items-center" style="border: 1px solid black;">
          <div class="input-div flex justify-content-center align-items-center lg:mr-3 mb-3" style="border: 1px solid black;">
            <InputText id="email" v-model="email" type="text" placeholder="Email address" class="w-full md:w-30rem mr-3 h-full" style="padding: 1rem" />
            <Button icon="pi pi-pencil" severity="help" class="p-button" style="background-color: black;"/>
          </div> 
          <div class="input-div flex justify-content-center align-items-center lg:mr-3 mb-3 md:mr-3" style="border: 1px solid black;">
            <InputText id="email" v-model="email" type="text" placeholder="Email address" class="w-full md:w-30rem mr-3 h-full" style="padding: 1rem" />
            <Button icon="pi pi-pencil" class="p-button" style="background-color: black;"/>
          </div>  
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const defaultImageUrl = "../src/assets/images/Profile-icon.jpg";
const profileImageUrl = ref(defaultImageUrl);


function onFileChange(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      profileImageUrl.value = reader.result;
    };
    reader.readAsDataURL(file);
  }
}

function openFileInput() {
  const fileInput = document.querySelector('input[type="file"]');
  if (fileInput) {
    fileInput.click();
  }
}
</script>
