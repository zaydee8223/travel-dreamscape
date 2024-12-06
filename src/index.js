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

    //check if user is on edit destination page
    if (window.location.hash === "#editDestination") {
        const destinationId = localStorage.getItem("currentDestinationId");
        if (!destinationId) {
            console.error("No destination ID found in localStorage");
            //redirect back to dashboard if no ID found
            window.location.hash = "#dashboard";
            return;
        }

        //fetch the existing destination data from firestore
        MODEL.fetchDesDataToEdit(destinationId);
    }

    //check if user is on edit destination site page
    if (window.location.hash === "#editDestinationSite"){
        const destinationId = localStorage.getItem("currentDestinationId");
        const siteId = localStorage.getItem("currentSiteId");

        if (!destinationId || !siteId) {
            console.error("No destinationId or siteId found in localStorage");
            window.location.hash = "#mainDestination";
            window.location.reload();
            return;
        }
          //fetch the existing destination data from firestore
          MODEL.fetchDesSiteDataToEdit(destinationId, siteId);
    }
}

function initListeners() {

    //ACCOUNT LISTENERS 
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
   $("#signout-btn").on("click", (e) => {
    //prevent default action of a tag
    e.preventDefault();
    
      //show modal
      $("#confirmLogoutModal").fadeIn();

      //sign out
      MODEL.signUserOut();
});

//signing out success
$("#confirm-logout-btn").on("click", () => {
    //hide modal
    $("#confirmLogoutModal").fadeOut();

    //redirect to home
    window.location.hash = "#home";
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

//clicking add destination on add des page
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

//clicking view on main destination site 
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

//close the main destination site modal when the "X" button is clicked
  $(".close-btn").on("click", () => {
    //hide modal with fade effect
    $("#site-details-modal").fadeOut();
  });


  //EDIT DESTINATION / DESTINATION SITE 

  //clicking edit on main destination
  $(".destinations").on("click", "#edit-main-des-btn", function () {
    const destinationId = $(this).data("id");
    if (!destinationId) {
        console.error("No destination ID found");
        return;
    }

    //store destinationId so correct one is edited
    localStorage.setItem("currentDestinationId", destinationId);

    //go to edit destination page
    window.location.hash = "#editDestination";
  });

  //clicking update destination on the edit form
  $("#edit-destination-btn").on("click", async (e) => {
    e.preventDefault();

    const destinationId = localStorage.getItem("currentDestinationId");
    if(!destinationId) {
        console.error("No destination ID found");
        return;
    }

    //grab the vals from the form
    const desName = $("#desName").val();
  const desDescrip = $("#desDescrip").val();
  const desArDate = $("#desArDate").val();
  const desDepDate = $("#desDepDate").val();
  const desImageFile = $("#desImage")[0].files[0];

  //if no new image chosen, use the old onw
  let imageURL =localStorage.getItem("oldDestinationImage");

  //if a new image is chose, upload it
  if (desImageFile) {
    imageURL = await MODEL.uploadImageToStorage(desImageFile);
  }

  //create a update obj w only the fields that have values
  //if user left some fields unchanged, use existing vals 
  const updateData = {
    desName: desName,
    desDescription: desDescrip,
    arrivalDate: desArDate,
    departDate: desDepDate,
    desImage: imageURL,
  };

  //update firestore document 
  await MODEL.updateDestinationInDB(destinationId, updateData);

  //redirect user back to dashboard
  window.location.hash = "#mainDestination";
  //reload to show changes
  window.location.reload();
  });

  //clicking edit on destination site
  $(".destination-sites").on("click", "#main-des-site-edit", function () {
    const siteId = $(this).data("site-id");
    const destinationId = localStorage.getItem("currentDestinationId");

    if (!siteId || !destinationId) {
        console.error("Missing site ID or destination ID");
        return;
    }

    //store the siteId in localStorage
    localStorage.setItem("currentSiteId", siteId);

    //go to edit destination site
    window.location.hash = "#editDestinationSite";
  });

  //clicking update destination on the edit form
  $("#edit-des-site-btn").on("click", async (e) => {
    e.preventDefault();

    const destinationId = localStorage.getItem("currentDestinationId");
    const siteId = localStorage.getItem("currentSiteId");

    if (!destinationId || !siteId) {
        console.error("No destination or site ID found");
        return;
    }

    //get the form values
    let siteName = $("#des-site-name").val();
    let siteDescrip = $("#des-site-descrip").val();
    const siteImageFile = $("#des-site-image")[0].files[0];

    //if user clears a field, revert to old data
    siteName = siteName || localStorage.getItem("oldSiteName");
    siteDescrip = siteDescrip || localStorage.getItem("oldSiteDescrip");

    //if no new image , use the old one
    let imageURL = localStorage.getItem("oldSiteImage");
    if (siteImageFile) {
      imageURL = await MODEL.uploadImageToStorage(siteImageFile);
    }

    //update the data into a new obj
    const updateData = {
        desSiteName: siteName,
        desSiteDescrip: siteDescrip,
        desSiteImage: imageURL
    };

    //update the site in the db
    await MODEL.updateSiteInDB(destinationId, siteId, updateData);

    //clear form data from localStorage
    localStorage.removeItem("oldSiteName");
  localStorage.removeItem("oldSiteDescrip");
  localStorage.removeItem("oldSiteImage");
  localStorage.removeItem("currentSiteId");

  //navigate back to main destination page
  window.location.hash = "#mainDestination";
  //reload to show changes
  window.location.reload();
  });

  //clicking edit on destination site details (modal)
  $("#modal-des-site-edit-btn").on("click", function() {
    //destination id from before fetched and site id from modal load
    const destinationId = localStorage.getItem("currentDestinationId");
    const siteId = localStorage.getItem("currentSiteId");

    if (!destinationId || !siteId) {
        console.error("No destinationId or siteId found");
        return;
    }

    //hide the modal
    $("#site-details-modal").fadeOut();

    //go to edit destination site page
    window.location.hash = "#editDestinationSite";
  });


  //DELETE DESTINATION / DESTINATION SITE

  //clicking delete on main destination
  $(".destinations").on("click", "#delete-main-des-btn", function () {
    const destinationId = $(this).data("id");

    if (!destinationId) {
        console.error("No destination ID found");
        return;
    }

    //store the destinationId so correct destination is deleted
    localStorage.setItem("currentDestinationId", destinationId);

    //show the confirmation modal
    $("#confirmDeleteModal").fadeIn();
  });

  //clicking cancel on the confirmation modal
  $("#cancel-delete-btn").on("click", function() {
    // Hide the confirmation modal
    $("#confirmDeleteModal").fadeOut();
  });

  //clicking delete on the confirmation modal
  $("#confirm-delete-btn").on("click", async function (){
    const destinationId = localStorage.getItem("currentDestinationId");

    if (!destinationId) {
        console.error("No destination ID found for deletion");
        return;
    }

    //call the func to delete the destination
    await MODEL.deleteDestination(destinationId);

    //hide the confirmation modal 
    $("#confirmDeleteModal").fadeOut();

    //show the delete done modal
    $("#deleteDesDoneModal").fadeIn();
  });

  //clicking ok on the delete done modal
  $("#delete-ok-btn").on("click", function(){
    $("#deleteDesDoneModal").fadeOut();

    //remove the deleteDestinationId since destination is deleted
    localStorage.removeItem("deleteDestinationId");
  });

  //clicking delete on a destination site
  $(".destination-sites").on("click", "#main-des-site-delete", function() {
    const siteId = $(this).data("site-id");
    const destinationId = localStorage.getItem("currentDestinationId");

    if (!siteId || !destinationId) {
        console.error("Missing siteId or destinationId");
        return;
      }

      //store siteId so correct site is deleted
      localStorage.setItem("currentSiteId", siteId);

      //show the existing confirmation modal
      $("#confirmDeleteSiteModal").fadeIn();
  });

   //clicking cancel on the confirmation modal
   $("#cancel-delete-site-btn").on("click", function() {
    // Hide the confirmation modal
    $("#confirmDeleteSiteModal").fadeOut();

    //remove the siteId from localStorage
    localStorage.removeItem("currentSiteId");
  });

  //clicking delete on the confirmation modal 
  $("#confirm-delete-site-btn").on("click", async function() {
    const destinationId = localStorage.getItem("currentDestinationId");
    const siteId = localStorage.getItem("currentSiteId");
  
    if (!destinationId || !siteId) {
      console.error("No destinationId or siteId found for deletion");
      return;
    }
  
    //call the model function to delete the site
    await MODEL.deleteSiteInDB(destinationId, siteId);
  
    //hide the confirmation modal 
    $("#confirmDeleteSiteModal").fadeOut();
  
    //show the delete site done modal
    $("#deleteSiteDoneModal").fadeIn();
  });

  //clicking ok on the delete done modal 
  $("#delete-site-ok-btn").on("click", function() {
    $("#deleteSiteDoneModal").fadeOut();
  
    //remove the siteId since we've finished deleting
    localStorage.removeItem("currentSiteId");

    window.location.reload();
  });

  //clicking delete on the modal details in destination site
  $("#modal-des-site-delete-btn").on("click", function () {
    const destinationId = localStorage.getItem("currentDestinationId");
    const siteId = localStorage.getItem("currentSiteId");

    if (!destinationId || !siteId) {
        console.error("No destinationId or siteId found");
        return;
    }

    //hide the modal
    $("#site-details-modal").fadeOut();

    //show the existing confirmation modal
    $("#confirmDeleteSiteModal").fadeIn();

    

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
