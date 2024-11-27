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

        //fetch their displayname
        const fullName = user.displayName;

        //grab only the first name 
        const firstName = fullName.split(" ")[0];

        //update the dashboard with the users name
        updateDashboard(firstName);

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
               <p class="signup-title">Sign Up</p>
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
        return `  <!-- navigation - only on logged in pages -->
          <nav class="logged-in-nav">
            <div class="logo"></div>

            <div class="links">
              <a href="#dashboard">Dashboard</a>
              <a href="#" id="signout-btn">Log Out</a>
            </div>
          </nav>
          <!-- display user's name w trips -->
           <div class="dash-headers">
            <h1 class="dash-users-trips">Trips</h1>
            <p class="dash-user-trip-stat">You haven't added any trips yet! Start your adventure by adding your dream destinations.</p>
           </div>

           <!-- every destination and button -->
           <div class="dash-main-des">
           <!-- add destination btn -->
            <div class="dash-add-des" id="dashboard-add-des-btn">
              <i class="fa-solid fa-plus"></i>
            </div>

            <!-- box for main destination -->
             <div class="dash-main-des-box">
               <img src="./images/mexico-thumb.jpg" id="" class="dash-main-des-img">
              
               <!-- title of destination -->
                <p class="dash-main-des-title">Mexico</p>
                <!-- small description of destination -->
                 <p class="dash-main-des-descrip">Can't wait to explore the beautiful beaches, indulge in authentic tacos, and visit ancient ruins! The vibrant culture and friendly locals make it a must-visit destination!</p>
                 <!-- dates box -->
                  <div class="dash-main-des-date-box">
                    <!-- arrival date -->
                     <p class="dash-main-des-arrive">12 - 20 - 2024 </p> 
                     <p class="dash-main-des-line"> |</p>
                     <!-- departure date -->
                      <p class="dash-main-des-depart">01 - 05 - 2025</p>
                  </div>

                  <!-- options for main destination -->
                   <div class="dash-main-des-option-box">
                    <!-- view btn -->
                     <button class="dash-main-des-option-btn" id="view-main-des-btn">View</button>

                      <!-- edit btn -->
                      <button class="dash-main-des-option-btn" id="edit-main-des-btn">Edit</button>

                       <!-- view btn -->
                     <button class="dash-main-des-option-btn" id="delete-main-des-btn">Delete</button>
                   </div>
             </div>
             
         </div>`;

         //add destination
         case "addDestination":
            return `<h1>Hello</h1>`;
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
               
               //go to modal functionality 
               showLoginSignupModal();

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
         
          //go to modal functionality
          showLoginSignupModal();

      })
      .catch((error) => {
          //handle login errors
          console.error("Login error:", error.message);
          alert("Login failed: " + error.message);
      });

}

//modal functionality - sign up and log in
function showLoginSignupModal() {

    //get the appropriate modal
    const modal = $("#loginSignupModal");

    //show the modal
    modal.show();

    //handle the proceed button
    $("#proceed-btn").on("click", () => {
       //hide the modal 
        modal.hide();

        //go to dashboard
        window.location.hash = "#dashboard";
    });

    //handle the cancel button
    $("#cancel-btn").on("click", () => {
        //hide the login/signup modal
        modal.hide();
    
        //show the logout modal
        showLogoutModal();
    });
}

//modal functionality - log out 
export function showLogoutModal() {
    //get the appropriate modal
    const modal = $("#confirmLogoutModal");

    //show the modal
    modal.show();

    //handle the okay button
    $("#confirm-logout-btn").on("click", () => {
        //hide modal
        modal.hide();

        //redirect to home
        window.location.hash = "#home";
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

//update the dashboard page with the users name 
function updateDashboard(userName){
    //check if a user is logged in
    if(userName) {
        //select the header from the dashboard name and update w their name
        $(".dash-users-trips").html(`${userName}'s Trips:`);
    }
}