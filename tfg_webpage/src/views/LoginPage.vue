<template>
  <div class="container">
    <div class="login-left">
       
    </div>
    
    <div class="login-form">
      <div class="form-image">
      <img src="../assets/title-logo.png" alt="Imagen de inicio de sesión">
    </div>
      <br>
      <form @submit.prevent="login()">
        <div class="input-group">
          <label class="input-label" for="username">Username</label>
          <br>
          <input class="custom-input"
            id="username"
            type="text"
            v-model="username"
            @keydown.enter="login()"
          >
          <p v-if="usernameError" class="error-message">{{ usernameError }}</p>
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
          <button class="login-button" type="submit">LOGIN</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>

  .custom-input {
    border: 2px solid black; 
    margin-top: 10px;
    padding: 8px; 
    width: 250px; 
    box-sizing: border-box; 
    height: 30px;
    border-radius: 7px;
  }

  .input-label{
    margin-right: 180px;
  }

  .container{
    /*margin-top: 250px;*/
    border: 2px solid black; 
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }

  .login-left {
    flex: 0.8;
    border: 2px solid black;
    background-color: black;
    height: 100%;
    align-items: center;
  }

  .login-form{
    background-color: #ffffff;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    flex: 1;
    padding: 0 20px;
  }

  .form-image img {
    max-width: 100%; 
    height: auto; 
    display: block; 
    margin: 0 auto; 
  }

  .login-button {
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
    margin-bottom: 10px;
  }
  .error-message {
    color: red;
    font-size: 12px;
    margin: 0px;
  }
</style>

<script>

export default {
  
  data() {
    return {
      username: "",
      password: "",
      usernameError: "",
      passError: "",
      validForm: "",
      remember: false,
      rules: {
        required: (value) => !!value || "Required.",
      },
    };
  },
  methods: {
    async login(){
      if (!this.checkUsername() || !this.checkPassword()){
        return;
      }
      this.$router.push('/about_view');
      
      
    },
    
    // Username comprobations
    checkUsername() {
      if (!this.username){
        this.usernameError = "You must provide a username";
        return this.validForm = false;
      }
      else {
        this.usernameError = "";
        return this.validForm = true;
      }
    },

    // Password comprobations
    checkPassword(){
      if (!this.password){
        this.passError = "You must provide a password";
        return this.validForm = false;
      }
      else{
        this.passError = "";
        return this.validForm = true;
      }
    },

    // User auth
    userAuth(){

    }
}
}
</script>
