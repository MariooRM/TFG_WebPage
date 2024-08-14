# Erased Memories Web Page
 This os the web page from the Erased Memories game.

 ![Erased Memories logo](https://firebasestorage.googleapis.com/v0/b/tfg-mariorodrigomarcos.appspot.com/o/Logo02.png?alt=media&token=f7776a9f-9d15-4572-91f1-cc8fb5e34c55)

 ### Install dependencies
 To install dependencies, run:
 ```bash
 npm i
 ```

### Local deployment
 In order to deploy the project locally, you will have to run:
```bash
 npm run dev
 ```


### Build
 To build the project, which is needed for firebase hosting, run:
 ```bash
 npm run build
 ```

 ### Initialize firebase tools
 This project supports hosting on Firebase Hosting service. If starting working within the project, you will need to follow
 these steps:

 #### 1. Login with Firebase account
 Run this command and select your account or introduce your email and password. The
 ```bash
 firebase login
 ```

 #### 2. Project selection
 Once you have logged in, you will have to select this project on the deployed list.

 #### 3. Firebase initialization
 Initialize Firebase services by running:
  ```bash
 firebase init
 ```

 ### Firebase hosting
 This project has Firebase tools integrated, so the webapp can be hosted running this command:
 ```bash
 firebase deploy
 ```

