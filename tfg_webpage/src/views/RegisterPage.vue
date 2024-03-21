<template>
  <div class="container">
    <div class="login-left">
      <img src="../assets/title-2.png" alt="Imagen de inicio de sesión">
    </div>
    
    <div class="login-right">
      <div class="form-title">
        <h1>REGISTER</h1>
      </div>
      <br>
      <div class="login-form">
        <form @submit.prevent="register()">
          <div class="input-columns">
            <!-- First column -->
            <div class="column">
              <div class="input-group">
                <label class="input-label" for="name">Name</label>
                <br>
                <input class="custom-input"
                  id="name"
                  type="text"
                  v-model="name"
                  @keydown.enter="register()"
                >
                <p v-if="nameError" class="error-message">{{ nameError }}</p>
              </div>
              <div class="input-group">
                <label class="input-label" for="surname">Surname</label>
                <br>
                <input class="custom-input"
                  id="surname"
                  type="text"
                  v-model="surname"
                  @keydown.enter="register()"
                >
              </div>
              <div class="input-group">
                <label class="input-label" for="email">Email</label>
                <br>
                <input class="custom-input"
                  id="email"
                  v-model="email"
                  @keydown.enter="register()"
                >
                <p v-if="emailError" class="error-message">{{ emailError }}</p>
              </div>
            </div>
            <!-- Second column -->
            <div class="column">
              <div class="input-group">
                <label class="input-label" for="username">Username</label>
                <br>
                <input class="custom-input"
                  id="username"
                  type="text"
                  v-model="username"
                  @keydown.enter="register()"
                >
                <p v-if="usernameError" class="error-message">{{ usernameError }}</p>
              </div>
              <div class="input-group">
                <label class="input-label" for="password">Password</label>
                <br>
                <input class="custom-input"
                  id="password"
                  type="password"
                  v-model="password"
                  @keydown.enter="register()"
                >
                <p v-if="passError" class="error-message">{{ passError }}</p>
              </div>
              <div class="input-group">
                <label class="input-label" for="repeatPassword">Confirm password</label>
                <br>
                <input class="custom-input"
                  id="repeatPassword"
                  type="password"
                  v-model="repeatPassword"
                  @keydown.enter="register()"
                >
                <p v-if="repeatPassError" class="error-message">{{ repeatPassError }}</p>
              </div>
            </div>
          </div>
          <br>
          <div class="form-div">
            <router-link style="width: 50%; padding: 10px 5px;" to="/">Already have an account?</router-link>
          </div>
          <br>
          <div>
            <button class="form-button" id="login-button" type="submit">REGISTER</button>
            <button class="form-button" id="back-button" @click="goBack()">BACK</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
  /** Main container*/
  .container{
    /*margin-top: 250px;*/
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }

  /** Left side: Company logo */
  .login-left {
    flex: 0.8;
    border: 2px solid black;
    background-color: black;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .login-left img{
      max-width: 100%; 
      
    }
   
  /** Right side: Login form */
  .login-right{
    background-color: #ffffff;
    
    padding: 20px;
    border-radius: 5px;
    flex: 1;
    padding: 0 20px;
    /* display: flex; */
    align-items: center;
    justify-content: center;
  }
  
  .login-form{
    padding: 30px;
    /* box-shadow: 0 0 10px rgb(116, 112, 112); */
    border: 3px solid black;
    border-radius: 7px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .input-columns {
    display: flex;
  }
  .column {
    flex: 1;
  }
  .column .input-group {
    margin-bottom: 20px;
  }

  .form-title{
    background-color: black;
    color: white;
  }

  .input-group{
    display: flex;
    flex-direction: column;
    text-align: center;
    justify-content: center;
    margin-left: 20px;
    margin-right: 10px;
  }

  .custom-input {
    border: 2px solid black; 
    padding: 8px; 
    width: 180px; 
    box-sizing: border-box; 
    height: 30px;
    border-radius: 7px;
  }

  .input-label{
    /* margin-right: 90px; */
    text-align: left;
    margin-bottom: -20px;
  }

  .form-button {
    background-color: green; 
    border: none; 
    border-radius: 7px; 
    color: white; 
    font-weight: bold; 
    font-size: 15px;
    padding: 10px 20px; 
    cursor: pointer; 
    transition: background-color 0.3s; 
    width: 170px;
    margin: 10px;
  }

  #login-button{
    background-color: rgb(5, 146, 5);
  }
  #back-button{
    background-color: red;
  }
  .error-message {
    color: red;
    font-size: 12px;
    margin: 0px;
  }
</style>

<script>

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

export default {
  
  data() {
    return {
      name: "",
      surname: "",
      email: "",
      username: "",
      password: "",
      repeatPassword: "",
      nameError: "",
      emailError: "",
      usernameError: "",
      passError: "",
      repeatPassError: "",
    };
  },
  methods: {
    async register(){
      if (!this.checkData()){
        return;
      }
      else{
        this.userSignUp();
      }
    },
    goBack(){
      this.$router.push('/');
    },
    
  
    checkData() {
      // Name comprobation
      if (!this.name){
        this.nameError = "You must provide a name";
        return false;
      }
      else{
        this.nameError = "";
      }

      // Username comprobation --> WE NEED TO CHECK IF THIS IS AN EXISTING USERNAME IN THE DB
      if (!this.username){
        this.usernameError = "You must provide a username";
        return false;
      }
      else{
        this.usernameError = "";
      }

      if (!this.isValidEmail(this.email)){
        this.emailError = "You must provide a valid email";
        return false;
      }
      else {
        this.emailError = "";
      }

      if (!this.checkPassword()){
        return false;
      }

      return true;
    },

    // Password comprobations
    checkPassword(){
      // CHECK PASSWORD INTEGRITY
      if (!this.password){
        this.passError = "You must provide a password";
        return false;
      }
      else{
        this.passError = "";
      }

      if (!this.repeatPassword){
        this.repeatPassError = "You must confirm your password";
        return false;
      }
      else{
        this.repeatPassError = "";
      }

      if (this.password != this.repeatPassword){
        this.passError = this.repeatPassError = "Passwords don't match";
        return false;
      }
      else{
        this.passError = "";
        this.repeatPassError = "";
      }

      return true;

    },
    isValidEmail(email){
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },

    // User registration method with Firebase
    userSignUp(){
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, this.email, this.password)
      .then(() => {
        console.log("User registered");
        console.log(auth.currentUser);
        alert("Successfully registered!");
        this.$router.push('/main_page');
      })
      .catch((error) => {
        alert(error.message);
      });
      
    }
}
}
</script>
