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

//clicking the dashboard link on navigation
$("#dashboard-link").on("click", () => {
    //go to dashboard
    window.location.hash = "#dashboard";
   //reload the page
   window.location.reload();
});


//ADD DESTINATION / DESTINATION SITE 
//clicking add destination on dashboard 
$("#dashboard-add-des-btn").on("click", () => {
      //go to add destination page
      window.location.hash = "#addDestination";
});

//clicking add destination site on the main destination page
$("#main-add-site").on("click", function () {
    const destinationId = $(this).data("destination-id");

    if(!destinationId) {
        console.error("No destination ID found");
        return;
    }
    //save the destination id in local storage
    localStorage.setItem("currentDestinationId", destinationId);
    
    //go to form
    window.location.hash = "#addDestinationSite";
});

// //clicking add destination on add des page
$("#add-destination-btn").on("click", (e) => {
    //prevent default form behavior
    e.preventDefault();

    //get values from the input fields

    //des name
    let desName = $("#desName").val();

    //des description
    let desDescription = $("#desDescrip").val();

    //des arrival date
    let arrivalDate =  $("#desArDate").val();

    //des departure date
    let departDate =  $("#desDepDate").val();

    //des image
    let desImage =  $("#desImage")[0].files[0];

    //valifate the form fields 
    if (!desName || !desDescription || !arrivalDate || !departDate || !desImage) {
        alert ("All fields are required! Please fill in all the fields.");
        return;
    }

    //create a destination obj
    let destinationObj = {
        desName: desName,
        desDescription: desDescription,
        arrivalDate: arrivalDate,
        departDate: departDate,
        desImage: desImage
    };

    //add the destination to the db
    MODEL.addDestinationToDB(destinationObj);

    //clear the form inputs 
    $("#desName").val("");
    $("#desDescrip").val("");
    $("#desArDate").val("");
    $("#desDepDate").val("");
    $("#desImage").val("");

    $(".dash-user-trip-stat").text("Loading your destination dreams..."); 
    //redirect to dashboard
    window.location.hash = "#dashboard";

});

//clicking add destination site to add des site to main destination
$("#add-des-site-btn").on("click", async (e) => {
    //prevent default form behavior
    e.preventDefault();

    const destinationId =  localStorage.getItem("currentDestinationId");

    //get values from the input fields

    //des name
    let desSiteName = $("#des-site-name").val();

    //des description
    let desSiteDescrip = $("#des-site-descrip").val();

    //des image
    let desSiteImage =  $("#des-site-image")[0].files[0];

    //valifate the form fields 
    if (!desSiteName || !desSiteDescrip ||!desSiteImage) {
        alert ("All fields are required! Please fill in all the fields.");
        return;
    }

    //call the function to add destination site
    await MODEL.addDestinationSite(destinationId, desSiteName, desSiteDescrip, desSiteImage);

    //clear the form 
    $("#des-site-name").val("");
    $("#des-site-descrip").val("");
    $("#des-site-image").val("");

     //reload the main destination info and sites
    MODEL.displayDestinationInfo(destinationId);

        //redirect to maindestination page
        window.location.hash = "#mainDestination";


});


// VIEW DESTINATION / DESTINATION SITE 
//clicking view on main destinations 
$(".destinations").on("click", "#view-main-des-btn", function () {
    const destinationId = $(this).data("id");
    
    if (!destinationId) {
        console.error("No destination ID found!");
        return;
    }
    //save the destinationId in localStorage
    localStorage.setItem("currentDestinationId", destinationId);

    window.location.hash = "#mainDestination";
    MODEL.displayDestinationInfo(destinationId);
});

// //clicking view on main destination site 
$(".destination-sites").on("click", "#main-des-site-view", function () {

    //grab the site id
    const siteId = $(this).data("site-id");
    const destinationId = localStorage.getItem("currentDestinationId");

    if (!siteId || !destinationId) {
        console.error("Missing Site ID or destination ID");
        return;
    }

    //fetch and display the site details
    MODEL.fechAndDisplaySiteDetails(destinationId, siteId);
  });


//   //close the main destination site modal when the "X" button is clicked
  $(".close-btn").on("click", () => {
    //hide modal with fade effect
    $("#site-details-modal").fadeOut();
  });

}

$(document).ready(() => {
    //set up listener to call the route func whenever hash in the url changes
    $(window).on("hashchange", route);

    //call the route function to load appropriate page content
    route();

    //check is user is on the main destination page
    if(window.location.hash === "#mainDestination") {
        const destinationId = localStorage.getItem("currentDestinationId");

        if (!destinationId) {
            console.error("no destination ID found in local storage");
            alert("No destination selected. Redirecting to dashboard.");
            window.location.hash = "#dashboard";
            return;
        }
        console.log("loading destination id: ", destinationId);

        //fetch and display the main destination info
        MODEL.displayDestinationInfo(destinationId);
    }

    //check if user is on add des page
    if (window.location.hash === "#addDestinationSite") {
        const destinationId = localStorage.getItem("currentDestinationId");

        if (!destinationId) {
            console.error("No destination id found in local storage");
            return;
        }
        console.log("Current destination id: ", destinationId);
    }
});
