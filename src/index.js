//import all funcs from model
import * as MODEL from "./model";
//import jquery
import * as $ from 'jquery';

//function to handle routing based on url hash
function route() {
    //get the hash from the current url
    let hashTag = window.location.hash;

    //remove the # from the hash and use "home" as default if hash is empty
    let pageID = hashTag.replace("#", "") || "home"; 

    //get content for current page id using model function
    const pageContent = MODEL.getPageContent(pageID);

    //replace content of app div with new page content
    $("#app").html(pageContent);

    //re init any event listeners for new content
    initListeners();
}

function initListeners() {

    //creating an acc
    $("#signup-submit").on("click", (e) => {
       
        //prevent from default travel 
        e.preventDefault(); 

        //grab vals from input 
        let fn = $("#fName").val();
        let ln = $("#lName").val();
        let sEm = $("#signEmail").val();
        let sPw = $("#signPass").val();

        //check to make sure all fields are filled
        if (!fn || !ln || !sEm || !sPw) {
            alert("All fields are required!");
            return;
        } 

        MODEL.createAccount(fn, ln, sEm, sPw);
    });

    //logged in
    $("#login-submit").on("click", (e) => {
         //prevent from default travel 
         e.preventDefault(); 

        //grab vals 
        let lEm = $("#logEmail").val();
        let lPw = $("#logPass").val();

         //check to make sure all fields are filled
         if (!lEm || !lPw) {
            alert("All fields are required!");
            return;
        } 
          MODEL.logUserIn(lEm, lPw);
    });

   //signing out
   $("#signout-btn").on("click", () => {
    MODEL.signUserOut(() => {
      //show modal
      MODEL.showLogoutModal();
    });
});

//clicking add destination
$("#dashboard-add-des-btn").on("click", () => {
      //go to add destination page
      window.location.hash = "#addDestination";
});

//clicking add destination site
$("#main-add-site").on("click", () => {
    //go to dashboard
    window.location.hash = "#addDestinationSite";
});

//clicking view on main destinations 
$(".destinations").on("click", "#view-main-des-btn", function () {
    const destinationId = $(this).data("id");
    console.log("Destination ID:", destinationId); // Check if this logs a valid ID
    if (!destinationId) {
        console.error("No destination ID found!");
        return;
    }
    window.location.hash = "#mainDestination";
    MODEL.displayDestinationInfo(destinationId);
});

//clicking the dashboard link on navigation
$("#dashboard-link").on("click", () => {
    //go to dashboard
    window.location.hash = "#dashboard";
   //reload the page
   window.location.reload();
})

// //clicking view on main destination site 
// $("#main-des-site-view").on("click", () => {
//     //show modal with fade effect
//     $("#site-details-modal").fadeIn();
//   });

//   //close the main destination site modal when the "X" button is clicked
//   $(".close-btn").on("click", () => {
//     //hide modal with fade effect
//     $("#site-details-modal").fadeOut();
//   });

// //clicking add destination on add des page
// $("#add-destination-btn").on("click", (e) => {
//     //prevent default form behavior
//     e.preventDefault();

//     //get values from the input fields

//     //des name
//     let desName = $("#desName").val();

//     //des description
//     let desDescription = $("#desDescrip").val();

//     //des arrival date
//     let arrivalDate =  $("#desArDate").val();

//     //des departure date
//     let departDate =  $("#desDepDate").val();

//     //des image
//     let desImage =  $("#desImage")[0].files[0];

//     //valifate the form fields 
//     if (!desName || !desDescription || !arrivalDate || !departDate || !desImage) {
//         alert ("All fields are required! Please fill in all the fields.");
//         return;
//     }

//     //create a destination obj
//     let destinationObj = {
//         desName: desName,
//         desDescription: desDescription,
//         arrivalDate: arrivalDate,
//         departDate: departDate,
//         desImage: desImage
//     };

//     //add the destination to the db
//     MODEL.addDestinationToDB(destinationObj);

//     //clear the form inputs 
//     $("#desName").val("");
//     $("#desDescrip").val("");
//     $("#desArDate").val("");
//     $("#desDepDate").val("");
//     $("#desImage").val("");

//     $(".dash-user-trip-stat").text("Loading your destination dreams..."); 
//     //redirect to dashboard
//     window.location.hash = "#dashboard";

// });


}


$(document).ready(() => {
    //set up listener to call the route func whenever hash in the url changes
    $(window).on("hashchange", route);

    //call the route function to load appropriate page content
    route();
});
