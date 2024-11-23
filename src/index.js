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
   // console.log("Page Content:", pageContent);

   //replace content of app div with new page content
    $("#app").html(pageContent);

    //re init any event listeners for new content
    initListeners();
}

function initListeners() {

    //creating an acc
    $("#signup-submit").on("click", (e) => {
        //grab vals 
        let fn = $("#fName").val();
        let ln = $("#lName").val();
        let sEm = $("#signEmail").val();
        let sPw = $("#signPass").val();

        //console the results 
        console.log("User created Account: " , fn, ln, sEm, sPw);
    });

    //logged in
    $("#login-submit").on("click", (e) => {
        //grab vals 
        let lEm = $("#logEmail").val();
        let lPw = $("#logPass").val();

        //console the results 
        console.log("User Logged In: " , lEm, lPw);

    });
}

$(document).ready(() => {
    //set up listener to call the route func whenever hash in the url changes
    $(window).on("hashchange", route);

    //call the route function to load appropriate page content
    route();
});
