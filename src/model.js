import * as $ from 'jquery';


import { initializeApp } from "firebase/app";

import { firebaseConfig } from "./firebaseConfig";

import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, updateProfile, signOut, signInWithEmailAndPassword } from "firebase/auth";

import { getFirestore, collection, addDoc, getDocs, onSnapshot } from 'firebase/firestore';

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

//on auth state changed func
onAuthStateChanged(auth, (user) => {
    //if there is a user 
    if (user) {
        console.log("logged in");

        //if no user / logged out
    } else {
        console.log("logged out");
    }
});

//contains all content for the app
export function getPageContent(pageID) {
    switch(pageID) {
        //home
        case "home":
            return `<!-- hero content-->
<div class="home-hero">
   <!-- video - constant loop -->
   <video autoplay muted loop class="home-hero-video">
       <source src="./images/home-hero-video.mp4" type="video/mp4">
       <!-- in case video doesnt work -->
       Your browser does not support the video tag.
   </video>
   <!-- overlay thatll go on top of video -->
    <div class="home-hero-overlay"></div>

   <!-- app title -->
    <h1>Travel Dreamscape</h1>

    <!-- app slogan -->
     <p class="home-slogan">Your travel story begins here.</p>

     <!-- app description -->
      <p class="home-descrip">Every great adventure starts with a dream. Whether you're planning a weekend getaway or a lifelong journey, our app is designed to help you curate your personal travel bucket list. Let's turn those dreams into destinations.</p>
     
      <!-- btn - lead to sign up / log in -->
       <div class="home-signlog-btn">
           <button class="home-start"><a href="#loginSignUp" id="home-button">Start Your Adventure</a></button>
       </div>
   </div>`;

   //login - signup 
   case "loginSignUp":
    return `   <!-- parent for forms -->
      <div class="login-signup-parent">

        <!-- login form --> 
         <div class="login-parent">
             <!-- form - log in -->
              <div class="login-form" id="login">
                 <!-- text to redirect to sign up -->
             <p class="redirection">Don't have an account? <span>Sign Up</span></p>
                <!-- form title -->
                <p class="login-title">Log In</p>
                <!-- email -->
                <label for="logEmail">Email Address:</label>
                <input type="email" id="logEmail" name="logEmail"/>

                 <!-- password -->
                 <label for="logPass">Password:</label>
                 <input type="password" id="logPass" name="logPass"/>

                 <!-- submit btn -->
                  <div class="login-submit-btn">
                    <a href="#dashboard"><button id="login-submit">Log In</button></a>
                  </div>
                 
              </div>
         </div>


           <!-- signup form --> 
           <div class="signup-parent">
            <!-- form - log in -->
             <div class="signup-form">
               <!-- form title -->
               <p class="signup-title">Sign In</p>
               <!--  first name -->
               <label for="fName">First Name:</label>
               <input type="text" id="fName" name="fName"/>

               <!-- last name -->
               <label for="lName">Last Name:</label>
               <input type="text" id="lName" name="lName"/>

                <!-- email -->
                <label for="signEmail">Email Address:</label>
                <input type="email" id="signEmail" name="signEmail"/>

                <!-- password -->
                <label for="signPass">Password:</label>
                <input type="password" id="signPass" name="signPass"/>

                <!-- submit btn -->
                 <div class="signup-submit-btn">
                 <a href="#dashboard"><button id="signup-submit">Sign Up</button></a>
                 </div>
                   <!-- text to redirect to log in -->
            <p class="redirection">Already have an account? <span>Log In</span></p>
             </div>
        </div>
      </div>`;

      //dashboard 
      case "dashboard":
        return `<a href="#home"><button id="signout-btn">Sign Out</button></a>`;

    default:
        return `<h1> 404 - Page Not Found</h1>`;
    }
}

//create account function
export function createAccount(fn, ln, sEm, sPw) {

    // use createUserWithEmailAndPassword to create a new user
    createUserWithEmailAndPassword(auth, sEm, sPw)
        .then((userCredential) => {
            //created a user
            const user = userCredential.user;
            //update the user's profile with their first and last name
            updateProfile(user, {
                displayName: `${fn} ${ln}`
            }).then(() => {
                console.log("Account created and profile updated:", user);
                //navigate to appropriate page
                window.location.hash = "#dashboard";
            }).catch((profileError) => {
                console.log("Error updating profile:", profileError.message);
            });

        })
        .catch((error) => {
            //any errors to creating acc
            console.log("Error creating account:", error.message);
        });
}

//logged in function
export function logUserIn(lEm, lPw) {
      //use signInWithEmailAndPassword to sign back in
      signInWithEmailAndPassword(auth, lEm, lPw)
      .then((userCredential) => {
          //success log in
          const user = userCredential.user;

          //navigate to appropriate page
          window.location.hash = "#dashboard";
      })
      .catch((error) => {
          //handle login errors
          console.error("Login error:", error.message);
          alert("Login failed: " + error.message);
      });

}

//signed out function
export function signUserOut() {
    signOut(auth)
    .then(() => {
      $(".profile .displayName").html("");
      $(".profile .profileImage").html("");
    })
    .catch((error) =>{
      console.log("error" , error.message);
    });
}
