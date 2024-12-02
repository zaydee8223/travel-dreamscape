import * as $ from 'jquery';

import { initializeApp } from "firebase/app";

import { firebaseConfig } from "./firebaseConfig";

import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, updateProfile, signOut, signInWithEmailAndPassword } from "firebase/auth";

import { getFirestore, collection, addDoc, getDocs, onSnapshot } from 'firebase/firestore';


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

var appFirstName = "";

//on auth state changed func
onAuthStateChanged(auth, (user) => {
    //if there is a user 
    if (user) {
        console.log("logged in");

        //fetch their displayname
        const fullName = user.displayName;

        //grab only the first name 
        const firstName = fullName.split(" ")[0];

        //the app first name is going to be the first name 
        appFirstName = firstName;

        //if no user / logged out
    } else {
        console.log("logged out");

        //clear the value of the user name
        appFirstName = "";
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
            <h1 class="dash-users-trips">${appFirstName}'s Trips</h1>
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
            return ` <!-- navigation - only on logged in pages -->
           <nav class="logged-in-nav">
            <div class="logo"></div>

            <div class="links">
              <a href="#dashboard">Dashboard</a>
              <a href="#" id="signout-btn">Log Out</a>
            </div>
          </nav>

          <!-- parent for content -->
           <div class="add-destination-parent">
            <!-- text box - title of page -->
             <p class="add-destination-title">Add a Destination</p>
             <!-- text box - page description -->
              <p class="add-destination-descrip">Let's bring your travel dreams to life! Add a destination and start crafting your perfect getaway.</p>
              <!-- form holder parent -->
               <div class="add-destination-form-parent">
                <!-- form input holder - for side by side -->
                 <div class="add-destination-form-side-parent">
                    <!-- form input parent -->
                 <div class="add-destination-inputs">
                  <!-- destination name -->
                   <label for="desName">Destination: </label>
                   <input type="text" name="desName" id="desName">

                   <!-- destination description -->
                    <label for="desDescrip">Description: </label>
                    <textarea name="desDescrip" id="desDescrip"></textarea>
                 </div>

                 <!-- form holder parent -->
                  <div class="add-destination-inputs">
                    <!-- arrival date -->
                     <label for="desArDate">Arrival Date: </label>
                     <input type="date" name="desArDate" id="desArDate"> 

                     <!-- departure date -->
                      <label for="desDepDate">Departure Date: </label>
                      <input type="date" name="desDepDate" id="desDepDate">
                      <!-- destination image - only one -->
                       <label for="desImage">Destination Image: </label>
                       <input type="file" name="desImage" id="desImage" accept="image/*">
                  </div>
                 </div>
                  <!-- submit btn for add destination -->
                   <div class="add-submit-btn">
                     <button id="add-destination-btn">Add Destination</button>
                   </div>
                  
               </div>
           </div>`;

           //add destination site
           case "addDestinationSite":
            return ` <!-- navigation - only on logged in pages -->
          <nav class="logged-in-nav">
           <div class="logo"></div>

           <div class="links">
             <a href="#dashboard">Dashboard</a>
             <a href="#" id="signout-btn">Log Out</a>
           </div>
         </nav>

         <!-- parent for content -->
          <div class="add-des-site-parent">
           <!-- text box - title of page -->
            <p class="add-des-site-title">Add a Destination Site</p>
            <!-- text box - page description -->
             <p class="add-des-site-descrip">Time to explore (Destination Name)! Add the sites you want to visit and start mapping out your adventure.</p>
             <!-- form holder parent -->
              <div class="add-des-site-form-parent">
                <div class="add-des-site-inputs">

                 <!-- destination name -->
                  <label for="des-site-name">Destination Site: </label>
                  <input type="text" name="des-site-name" id="des-site-name">

                   <!-- destination site images -->
                   <label for="des-site-image">Destination Site Image: </label>
                   <input type="file" name="des-site-image" id="des-site-image" accept="image/*">

                  <!-- destination description -->
                   <label for="des-site-descrip">Description: </label>
                   <textarea name="des-site-descrip" id="des-site-descrip"></textarea>
                </div>
              </div>


                 <!-- submit btn for add destination -->
                 <div class="add-submit-btn">
                  <button id="add-des-site-btn">Add Destination Site</button>
                </div>
          </div>`;

          //main destination view 
          case "mainDestination":
            return `     <!-- navigation - only on logged in pages -->
         <nav class="logged-in-nav">
          <div class="logo"></div>

          <div class="links">
            <a href="#dashboard">Dashboard</a>
            <a href="#" id="signout-btn">Log Out</a>
          </div>
        </nav>

        <!-- big hero image - main des image -->
         <div class="main-des-hero">
          <!-- text content inside of hero -->
           <div class="main-des-content">
            <!-- title of destination -->
             <p class="main-des-name-title">Welcome to Mexico!</p>
             <!-- description of destination -->
              <p class="main-des-descrip">Can't wait to explore the beautiful beaches, indulge in authentic tacos, and visit ancient ruins! The vibrant culture and friendly locals make it a must-visit destination! Can't wait to explore the beautiful beaches, indulge in authentic tacos, and visit ancient ruins! The vibrant culture and friendly locals make it a must-visit destination!</p>
              <!-- dates of travel -->
               <div class="main-des-dates">
                <!-- arrival date  -->
                 <p class="main-des-arr-date">12 - 20 - 2024</p>
                 <!-- line -->
                  <p class="line"> | </p>
                  <!-- departure date -->
                   <p class="main-des-dep-ate">01 - 05 - 2025</p>
               </div>
           </div>
         </div>

         <!-- itinerary section -->
          <p class="main-des-itin">Your (Destination Name) Itinerary:</p>
          <!-- status of itinerary text -->
           <p class="main-des-itin-stat">No places added yet! Start planning your stops!</p>
           <!-- holder for buttons - add sites and added sites -->
            <div class="main-des-stops">
              <!-- add a site btn -->
               <div class="main-add-des-stop-btn">
                <button id="main-add-site">Add Site</button>
               </div>
               <!-- sites added -->
                <div class="main-des-site-box">
                  <!-- name of site -->
                   <p class="main-des-site-title">Veracruz</p>
                   <!-- buttons with options to view edit delete -->
                    <div class="main-des-site-opt-box">
                      <!-- button - add -->
                       <button id="main-des-site-view">View</button>

                       <!-- button - edit -->
                        <button id="main-des-site-edit">Edit</button>

                        <!-- button - delete -->
                         <button id="main-des-site-delete">Delete</button>
                    </div>
                </div>
            </div>

            <!-- destination site modal -->
<div id="site-details-modal" class="modal hidden">
  <div class="modal-content">
    <span class="close-btn">&times;</span>
    <h2 id="modal-site-title">Veracruz</h2>
    <img id="modal-site-image" src="./images/veracruz.jpeg" alt="Veracruz Image" class="modal-image" />
    <p id="modal-site-description">
Veracruz is a vibrant coastal city full of history, culture, and stunning beaches. From exploring the historic Fort of San Juan de Ulúa to savoring fresh seafood by the waterfront, it's the perfect blend of adventure and relaxation.</p>
  </div>
</div>`;
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