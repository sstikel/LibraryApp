/*****************************************
*Doc.: libraryJS.js
*Author: Sam Gay
*Date: 4/8/19
*Purpose: javascript for libraryHome.html and login.html
*******************************************/

///////////////////Library Home //////////////////////////
function btnLogin(){
  console.log("Button clicked: login")
  window.location.href = "/login";
}

///////////////////// Display Library /////////////////
function displayLibrary(){
  $.get("/getLibrary", {library:library}, function(result){
    for (var i=0; i < result.list.length; i++) {
      var library = result.list[i];

      $("#library").append("<li>" + library.title + " " + library.subtitle + " " + library.length +"</li>");
    }
  });
}