//import all necessary dependencies from firebase + import jquery
import * as $ from 'jquery';

import { initializeApp } from "firebase/app";

import { firebaseConfig } from "./firebaseConfig";

import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, updateProfile, signOut, signInWithEmailAndPassword } from "firebase/auth";

import { getFirestore, collection, addDoc, getDocs, onSnapshot, DocumentReference, query, where, doc, getDoc, updateDoc, deleteDoc} from 'firebase/firestore';

import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

//init app, auth, db, storage
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

const storage = getStorage(app);

//on auth state changed func
onAuthStateChanged(auth, (user) => {
    //if there is a user 
    if (user) {
        console.log("logged in");

        //attach firestore listener for the curent users destinations
        const userId = user.uid;
        fetchUserDestinations(userId);

        //if no user / logged out
    } else {
        console.log("logged out");
    }
});

//PAGE CONTENT

//func that contains all content for the app
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
        return `   <!-- navigation - only on logged in pages -->
           <nav class="logged-in-nav">
            <div class="logo"></div>

            <div class="links">
              <a href="#dashboard">Dashboard</a>
              <a href="#" id="signout-btn">Log Out</a>
            </div>
          </nav>
          <!-- display user's name w trips -->
           <div class="dash-headers">
            <h1 class="dash-users-trips">Your Trips</h1>
            <p class="dash-user-trip-stat"></p>
           </div>
           
           <!-- every destination and button -->
           <div class="dash-main-des">
            <!-- add destination btn -->
            <div class="dash-add-des" id="dashboard-add-des-btn">
              <i class="fa-solid fa-plus"></i>
            </div> 
            <div class="destinations"> 
             </div>
         </div>`;

         //add destination
         case "addDestination":
            return ` <!-- navigation - only on logged in pages -->
           <nav class="logged-in-nav">
            <div class="logo"></div>

            <div class="links">
              <a href="#dashboard" id="dashboard-link">Dashboard</a>
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
            return `<!-- navigation - only on logged in pages -->
          <nav class="logged-in-nav">
           <div class="logo"></div>

           <div class="links">
             <a href="#dashboard" id="dashboard-link">Dashboard</a>
             <a href="#" id="signout-btn">Log Out</a>
           </div>
         </nav>

         <!-- parent for content -->
          <div class="add-des-site-parent">
           <!-- text box - title of page -->
            <p class="add-des-site-title">Add a Destination Site</p>
            <!-- text box - page description -->
             <p class="add-des-site-descrip">Time to explore! Add the sites you want to visit and start mapping out your adventure.</p>
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
            <a href="#dashboard" id="dashboard-link">Dashboard</a>
            <a href="#" id="signout-btn">Log Out</a>
          </div>
        </nav>

         <!-- big hero image - main des image -->
         <div class="main-des-hero">
          <!-- text content inside of hero -->
           <div class="main-des-content">
            <!-- title of destination -->
             <p class="main-des-name-title"></p>
             <!-- description of destination -->
              <p class="main-des-descrip"</p>
              <!-- dates of travel -->
               <div class="main-des-dates">
                <!-- arrival date  -->
                 <p class="main-des-arr-date"></p>
                 <!-- line -->
                  <p class="line"> | </p>
                  <!-- departure date -->
                   <p class="main-des-dep-date"></p>
               </div>
           </div>
         </div>

           <!-- itinerary section -->
          <p class="main-des-itin"></p>
          <p class="main-des-itin-stat"></p>
          <!-- status of itinerary text -->
           <!-- holder for buttons - add sites and added sites -->
            <div class="main-des-stops">
              <!-- add a site btn -->
               <div class="main-add-des-stop-btn">
                <button id="main-add-site">Add Site</button>
               </div>
               <div class = "destination-sites"></div>
            </div>
            
                         <!-- destination site modal -->
<div id="site-details-modal" class="modal hidden">
  <div class="modal-content">
    <span class="close-btn">&times;</span>
    <h2 id="modal-site-title"></h2>
    <img id="modal-site-image" src="" alt="Site Image" class="modal-image" />
    <p id="modal-site-description"></p>
  <!-- buttons inside of modal - edit and delete -->
   <div class="modal-options-btn">
    <!-- edit button -->
     <button id="modal-des-site-edit-btn">Edit</button>

     <!-- delete button -->
      <button id="modal-des-site-delete-btn">Delete</button>
   </div>
</div>
</div>`;

          //edit destination
          case "editDestination":
            return `  <!-- navigation - only on logged in pages -->
           <nav class="logged-in-nav">
            <div class="logo"></div>

            <div class="links">
              <a href="#dashboard" id="dashboard-link">Dashboard</a>
              <a href="#" id="signout-btn">Log Out</a>
            </div>
          </nav>

          <!-- parent for content -->
           <div class="edit-destination-parent">
            <!-- text box - title of page -->
             <p class="edit-destination-title">Update Destination</p>
             <!-- text box - page description -->
              <p class="edit-destination-descrip">Fine-tune your travel plans! Update your destination details to make sure everything’s set for an amazing trip.</p>
              <!-- form holder parent -->
               <div class="edit-destination-form-parent">
                <!-- form input holder - for side by side -->
                 <div class="edit-destination-form-side-parent">
                    <!-- form input parent -->
                 <div class="edit-destination-inputs">
                  <!-- destination name -->
                   <label for="desName">Destination: </label>
                   <input type="text" name="desName" id="desName">

                   <!-- destination description -->
                    <label for="desDescrip">Description: </label>
                    <textarea name="desDescrip" id="desDescrip"></textarea>
                 </div>

                 <!-- form holder parent -->
                  <div class="edit-destination-inputs">
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
                     <button id="edit-destination-btn">Update Destination</button>
                   </div>
                  
               </div>
           </div>`;

           //edit destination site
           case "editDestinationSite":
            return ` <!-- navigation - only on logged in pages -->
          <nav class="logged-in-nav">
            <div class="logo"></div>
 
            <div class="links">
              <a href="#dashboard" id="dashboard-link">Dashboard</a>
              <a href="#" id="signout-btn">Log Out</a>
            </div>
          </nav>
 
          <!-- parent for content -->
           <div class="edit-des-site-parent">
            <!-- text box - title of page -->
             <p class="edit-des-site-title">Update Destination Site</p>
             <!-- text box - page description -->
              <p class="edit-des-site-descrip">Make it unforgettable! Update the details for this spot to ensure it's just right for your adventure.</p>
              <!-- form holder parent -->
               <div class="edit-des-site-form-parent">
                 <div class="edit-des-site-inputs">
 
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
                   <button id="edit-des-site-btn">Update Destination Site</button>
                 </div>
           </div>`;
    default:
        return `<h1> 404 - Page Not Found</h1>`;
    }
}

//ACCOUNT CREATION 

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

                //force refresh the user state (this will trigger onAuthStateChanged again)
                onAuthStateChanged(auth, (user) => {
                  if (user) {
                      const fullName = user.displayName;
                      const firstName = fullName.split(" ")[0];
                      //first name will be available too
                      appFirstName = firstName;  
                  }
              });
               
              //go to dashboard
        window.location.hash = "#dashboard";
        
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

          //go to dashboard
        window.location.hash = "#dashboard";

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
    modal.fadeIn();

    //handle the proceed button
    $("#proceed-btn").on("click", () => {
       //hide the modal 
        modal.fadeOut();
    });
}

//signed out function
export function signUserOut() {
    signOut(auth)
    .then(() => {
      $(".profile .displayName").html("");
      $(".profile .profileImage").html("");
      // Clear userId from localStorage
      localStorage.removeItem('userId');

    })
    .catch((error) =>{
      console.log("error" , error.message);
    });
}

//ADD A DESTINATION AND DESTINATION SITE 

//add destination to firestore
export async function addDestinationToDB(destinationObj){
  //get the current users uid
  const userId = auth.currentUser?.uid;
  if(!userId) {
    console.error("No user is logged in.");
    return;
  }

  //upload the img and get the url 
  const imageURL = await uploadImageToStorage(destinationObj.desImage);

  //add the destination document to firestore
  await addDoc(collection(db, "destinations"),{
    ...destinationObj,
    desImage: imageURL,
    //attach the user id
    userId: userId
  }).then((docRef) =>{
    console.log("Document written with ID: " , docRef.id);
  }).catch((error)=>{
    console.error("Error adding document: ", error.message);
  });
}

//uplpad the image to firebase storage
export async function uploadImageToStorage(imageFile){
  //create a reference to firebase storage location where the image will be
  const storageRef = ref(storage, 'destinations/' + imageFile.name);

  try {
    //upload the file to firebase storage
    await uploadBytes(storageRef, imageFile);

    //get the download URL for the uploaded image
    const downloadURL = await getDownloadURL(storageRef);

    //return the download url
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image: ", error.message);
    throw new Error("Error uploading image to Firebase Storage");
  }
}

//query firestore for documents where userId matches the logged-in user's uid
export function fetchUserDestinations(userId) {

  // show a loading message while fetching
  $(".dash-user-trip-stat").html("Loading your destination dreams...");

  //set a flag to check if firestore response is processed
  let dataFetched = false;

  //query firestore for destinations where userId matches
  const queryRef = query(collection(db, "destinations"), where("userId", "==", userId));

  //attach Firestore listener
  onSnapshot(queryRef, (snapshot) => {
    $(".destinations").html("");
    let destinationString = "";
    //mark data as fetched
    dataFetched = true;

    if (snapshot.empty) {
      //no destinations: update the message
      $(".dash-user-trip-stat").text(
        "You haven't added any trips yet! Start your adventure by adding your dream destinations."
      );
    } else {
      // destinations exist: update the message
      $(".dash-user-trip-stat").text(
        "Your dream list is shaping up! Select a trip to view, edit, or remove from your list."
      );

      //add destinations
      snapshot.forEach((doc) => {
        const data = doc.data();
        destinationString += `<div class="dash-main-des-box">`;
        destinationString += `<img src="${data.desImage}" class="dash-main-des-img">`;
        destinationString += `<p class="dash-main-des-title">${data.desName}</p>`;
        destinationString += `<p class="dash-main-des-descrip">${data.desDescription}</p>`;
        destinationString += `<div class="dash-main-des-date-box">`;
        destinationString += `<p class="dash-main-des-arrive">${data.arrivalDate}</p>`;
        destinationString += `<p class="dash-main-des-line"> |</p>`;
        destinationString += `<p class="dash-main-des-depart">${data.departDate}</p>`;
        destinationString += `</div>`;
        destinationString += `<div class="dash-main-des-option-box">`;
        destinationString += `<button class="dash-main-des-option-btn" id="view-main-des-btn" data-id="${doc.id}">View</button>`;
        destinationString += `<button class="dash-main-des-option-btn" id="edit-main-des-btn" data-id="${doc.id}">Edit</button>`;
        destinationString += `<button class="dash-main-des-option-btn" id="delete-main-des-btn" data-id="${doc.id}">Delete</button>`;
        destinationString += `</div>`;
        destinationString += `</div>`;
      });

      //append the destinations to the DOM
      $(".destinations").append(destinationString);
    }
  });

  // timeout as a safety measure if Firestore is slow
  setTimeout(() => {
    if (!dataFetched) {
      $(".dash-user-trip-stat").text("Still loading, please wait...");
    }
  }, 3000);
}

//func that fetches the clicked destinations data from firestore and populates the page
export function displayDestinationInfo(destinationId) {
  //get the firestore document by its id
  const destinationRef = doc(db, "destinations", destinationId);

  getDoc(destinationRef).then((docSnap) => {
    if(docSnap.exists()) {
      const data = docSnap.data();

      //check if the destination belongs to the current user
      const currentUser = auth.currentUser?.uid;
      if (data.userId !== currentUser) {
        console.error("Destination does not belong to the logged in user");
        localStorage.removeItem("currentDestinationId");
        alert("This destination is not accessible. Redirecting to dashboard.");
        window.location.hash ="#dashboard"; 
        return;
      }

      //populate the main destination page
      $(".main-des-name-title").text(`Welcome to ${data.desName}!`);
            $(".main-des-descrip").text(data.desDescription);
            $(".main-des-arr-date").text(data.arrivalDate);
            $(".main-des-dep-date").text(data.departDate);
            $(".main-des-hero").css(
              "background-image",
              `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${data.desImage})`
            );  
            $(".main-des-itin").text(`Your ${data.desName} Itinerary:`);

            //pass the destination id to the add site button
            $("#main-add-site").data("destination-id", destinationId);

            //fetch and display destination sites for this main destination
            displayDestinationSites(destinationId);

        } else {
            console.error("No such document!"); localStorage.removeItem("currentDestinationId");
            alert("Destination not found. Redirecting to dashboard.");
            window.location.hash = "#dashboard";
        }
  }).catch((error) => {
    console.error("Error fetching destination: ", error);
    alert("An error occurred. Redirecting to dashboard.");
      localStorage.removeItem("currentDestinationId");
      window.location.hash = "#dashboard";
  })
}

//func that will add the destination site to correct sub collection for destination
export async function addDestinationSite(destinationiD, desSiteName, desSiteDescrip, desSiteImage) {
  const sitesRef = collection(db, "destinations", destinationiD, "sites");

  try {
    //upload the site image and get its url
    const imageURL = await uploadImageToStorage(desSiteImage);

    //add the new site to firestore
    await addDoc(sitesRef, {
      desSiteName: desSiteName,
      desSiteDescrip: desSiteDescrip,
      desSiteImage: imageURL,
    });
    console.log("destination site added successfully");
  } catch (error) {
    console.error("error adding destination site: ", error);
  }
}

//func to fetch and display destination sites for specific destination
export function displayDestinationSites(destinationId){
  const sitesRef = collection(db, "destinations", destinationId, "sites");

  //show loading message while data is being retrieved
  $(".main-des-itin-stat").html("Retrieving your itinerary...");

  //query firestore for the destination sites
  onSnapshot(sitesRef, (snapshot) => {
    let sitesString = "";
    $(".destination-sites").html("");

    if (snapshot.empty) {
        //no sites = display message
        $(".main-des-itin-stat").text(
          "No places added yet! Start planning your stops!"
        );
      } else {
        //sites exist - update message
        $(".main-des-itin-stat").text(
          "Your journey is coming together! Add more places to make it unforgettable."
        );

      snapshot.forEach((doc) => {
        const siteData = doc.data();

        //build the html structure for each site
        sitesString +=  `<div class="main-des-site-box" data-site-id="${doc.id}">`;
        sitesString +=  `<p class="main-des-site-title">${siteData.desSiteName}</p>`;
        sitesString += `<div class="main-des-site-opt-box">`;
        sitesString += `<button id="main-des-site-view" data-site-id="${doc.id}">View</button>`;
        sitesString += `<button id="main-des-site-edit" data-site-id="${doc.id}">Edit</button>`;
        sitesString += ` <button id="main-des-site-delete" data-site-id="${doc.id}">Delete</button>`;
        sitesString += ` </div>`;
        sitesString += ` </div>`;
      });
    }

    //insert the html data into the container
    $(".destination-sites").append(sitesString);
  }, (error) => {
    console.error("Error fetching destination sites: ", error);
  });
  }

//func to fetch and display site details in the modal
export function fechAndDisplaySiteDetails(destinationId, siteId) {
  const siteRef = doc(db, "destinations", destinationId, "sites", siteId);

  getDoc(siteRef).then((docSnap) => {
    if (docSnap.exists()) {
      const siteData = docSnap.data();

      //populate the modal with the site data
      $("#modal-site-title").text(siteData.desSiteName);
      $("#modal-site-image").attr("src", siteData.desSiteImage);
      $("#modal-site-description").text(siteData.desSiteDescrip);

      //store the current siteId so correct site is edited later
      localStorage.setItem("currentSiteId", siteId);

      //show the modal
      $("#site-details-modal").fadeIn();
    } else {
      console.error("No such site document");
    }
  }). catch((error) => {
    console.error("Error fetching site details: ", error);
  });
}

//EDIT DESTINATION AND DESTINATION SITE

//func to fetch the existing destination data and prefill the form
export function fetchDesDataToEdit(destinationId){
  const destinationRef = doc(db, "destinations", destinationId);

  getDoc(destinationRef).then((docSnap) => {
    if (docSnap.exists()){
      const data = docSnap.data();

      //prefill the form details
      $("#desName").val(data.desName);
      $("#desDescrip").val(data.desDescription);
      $("#desArDate").val(data.arrivalDate);
      $("#desDepDate").val(data.departDate);

       //storca old data in localStorage if you want to restore old values if user empties fields
       localStorage.setItem("oldDesName", data.desName);
       localStorage.setItem("oldDesDescrip", data.desDescription);
       localStorage.setItem("oldArDate", data.arrivalDate);
       localStorage.setItem("oldDepDate", data.departDate);

      //store the old image url so if user doesnt change it, keep old one
      localStorage.setItem("oldDestinationImage", data.desImage);
    } else {
      console.error("No such document");
      alert("Destination not found. Redirecting to Dashboard...");
      window.location.hash = "#dashboard";
    }
  }).catch((error) => {
    console.error("Error fetching destination: ", error);
    alert("An error occurred. Redirecting to dashboard...");
    window.location.hash = "#dashboard";
  });
}

//func to update firestore 
export async function updateDestinationInDB(destinationId, updateData) {
  const destinationRef = doc(db, "destinations", destinationId);

  try {
    await updateDoc(destinationRef, updateData);
    console.log("Destination updated successfully");
  } catch (error) {
    console.error("Error updating destination: ", error);
    alert("An error ocurred while updating the destination.");
  }
}

//func to fetch the destinationsite data to edit 
export function fetchDesSiteDataToEdit(destinationId, siteId) {
  const siteRef = doc(db, "destinations", destinationId, "sites", siteId);

  getDoc(siteRef).then((docSnap) => {
    if (docSnap.exists()) {
      const siteData = docSnap.data();

      //prefill the edit form
      $("#des-site-name").val(siteData.desSiteName);
      $("#des-site-descrip").val(siteData.desSiteDescrip);

      //store old values in localStorage
      localStorage.setItem("oldSiteName", siteData.desSiteName);
      localStorage.setItem("oldSiteDescrip", siteData.desSiteDescrip);
      localStorage.setItem("oldSiteImage", siteData.desSiteImage);
    }else {
      console.error("No such site document");
      alert("Site not found. Redirecting to main destination...");
      window.location.hash = "#mainDestination";
      window.location.reload();
    }
  }).catch((error) => {
    console.error("Error fetching site details:", error);
    alert("An error occurred. Redirecting to main destination...");
    window.location.hash = "#mainDestination";
    window.location.reload();
  });
}

//func to update firestore
export async function updateSiteInDB(destinationId, siteId, updateData) {
  const siteRef = doc(db, "destinations", destinationId, "sites", siteId);

  try {
    await updateDoc(siteRef, updateData);
    console.log("Site updated successfully");
  } catch (error) {
    console.error("Error updating site:", error);
    alert("An error ocurred while updating the site.");
  }
}

//DELETE DESTINATION AND DESTINATION SITE

//func to delete destination
export async function deleteDestination(destinationId) {
  const destinationRef = doc(db, "destinations", destinationId);

  try {
    await deleteDoc(destinationRef);
    console.log("Destination deleted successfully");
  } catch(error) {
    console.error("Error deleting destination: ", error);
    alert("An error occurred while deleting the destination");
  }
}

//func to delete destination site
export async function deleteSiteInDB(destinationId, siteId) {
  const siteRef = doc(db, "destinations" , destinationId, "sites", siteId);

  try {
    await deleteDoc(siteRef);
    console.log("Destination site deleted successfully");
  } catch (error) {
    console.error("Error deleting destination site: ", error);
    alert("An error occurred while deleting the destination site.");
  }
}