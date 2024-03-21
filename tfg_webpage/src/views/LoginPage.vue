<template>
  <div class="container">
    <div class="login-left">
       <img src="../assets/title-2.png" alt="Imagen de inicio de sesión">
    </div>
    
    <div class="login-right">
      
      <div class="form-title">
        <h1>LOGIN</h1>
      </div>
      <br>
      <div class="login-form">
        <form @submit.prevent="login()">
        <div class="input-group">
          <label class="input-label" for="email">Email</label>
          <br>
          <input class="custom-input"
            id="email"
            type="text"
            v-model="email"
            @keydown.enter="login()"
          >
          <p v-if="emailError" class="error-message">{{ emailError }}</p>
        </div>
        <br>
        <div class="input-group">
          <label class="input-label" for="password">Password</label>
          <br>
          <input class="custom-input"
            id="password"
            type="password"
            v-model="password"
            @keydown.enter="login()"
          >
          <p v-if="passError" class="error-message">{{ passError }}</p>
        </div>
        <br>
        <div class="form-div">
          <router-link style="width: 50%; padding: 10px 5px;" to="/register">Forgot password?</router-link>
        </div>
        <div class="form-div">
          <router-link style="width: 50%; padding: 10px 5px;" to="/register">Don't have an account?</router-link>
        </div>
        <br>
        <div>
          <button class="form-button" id="login-button" type="submit">LOGIN</button>
          <button class="form-button" id="back-button" @click="goBack()">BACK</button>
        </div>
        <div>
          
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
  .login-left img{
    max-width: 100%; 
  }

  .login-form{
    padding: 30px;
    /* box-shadow: 0 0 10px rgb(116, 112, 112); */
    border: 3px solid black;
    border-radius: 7px;
    display: flex;
    justify-content: center;
    align-items: center;
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
    align-items: center;
  }

  .custom-input {
    border: 2px solid black; 
    padding: 8px; 
    box-sizing: border-box; 
    height: 30px;
    border-radius: 7px;
  }

  .input-label{
    text-align: left;
    margin-bottom: -20px;
    margin-right: 130px;
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
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';


export default {
  
  data() {
    return {
      email: "",
      password: "",
      emailError: "",
      passError: "",
      validForm: false,
    };
  },
  methods: {
    async login(){
      
      if (!this.makeComprobations()){
        return;
      }
      else{
        this.userSignIn();
      }
      
      
    },
    goBack(){
      this.$router.push('/register');
    },
    
    // Username comprobations
    checkEmail() {
      if (!this.email || !this.isValidEmail(this.email)){
        this.emailError = "You must provide a valid email";
        return false;
      }
      else {
        this.emailError = "";
        return true;
      }
    },

    // Password comprobations
    checkPassword(){
      if (!this.password){
        this.passError = "You must provide a password";
        return false;
      }
      else{
        this.passError = "";
        return true;
      }
    },
    isValidEmail(email){
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },
    makeComprobations(){
      if (!this.checkEmail() || !this.checkPassword()){
        return false;
      }
      return true;

    },

    // User auth
    userSignIn(){
      const auth = getAuth();
      signInWithEmailAndPassword(auth, this.email, this.password)
      .then(() => {
        console.log("user logged in");
        console.log(auth.currentUser);
        alert("Logged in!");
        this.$router.push('/main_page');
      })
      .catch(() => {
        alert("Wrong email or password");
      });
      
    },
    /*showErrorMessage(error){
      switch(error) {
        case "auth/invalid"
      }
    }*/
}
}
</script>
