/*******************************************************
 * File: libraryController.js
 * Author: Sam Gay
 * Date: 3/16/19
 * Purpose: Controller functions for the library site
 *******************************************************/
const model = require("../model/libraryModel.js");


//display home
function libraryHome(req, res) {
 res.redirect("libraryHome.html");
}

//display library - make user specific
function getLibrary(req, res){
  model.getLibrary(function(err, libraryResults){
    //var library = req.query.library;

      res.json(libraryResults);
   
    
    
    // if(req.session.username){
    //   model.getLibrary(function(result){
    //     res.sendFile('libraryHome.html');
    //   });
    //}
    
  });


  //res.json(data);
  //res.render("", params);
}

//search library
function search(req, res){
  model.search(req, function(err, result){
    //input 'req' may need formating
    res.json(result);
  });
}

//add library item
function addItem(req, res){
  model.addItem(req, function(err, result){
    //req probably needs to be formatted
    res.json(result);
  });
}

//remove library item
function removeItem(req, res){
  model.removeItem(req, function(err, result){
    //req probably needs to be formatted
    res.json(result);
  });

}


//////////////// USER /////////////////////////////
//login
function login(req, res){
  res.redirect("login.html");
}

function handleLogin(req, res){
  const username = req.body.username;
  const password = req.body.password;

  model.login(username, password, function(err, data){
    if (err) {
      console.log("Error with login...");
      console.log(err);
    }
    else {
      req.session.username = username;

      res.redirect("displayLibrary.html");
    }
  });  
}

//logout
function logout(req, res){
  if(req.session.username) {
    req.session.destroy();
  }
  res.redirect("libraryHome.html");
}

//Createuser
function createUser(req, res) {
  const username = req.body.username;
  const password = req.body.password;
  const name_first = req.body.name_first;
  const name_last = req.body.name_last;

  console.log("controller: createUser...");

  model.createUser(username, password, name_first, name_last, function(err, data){
    res.redirect("libraryHome.html");  
  });

  
}

 



module.exports = {
  libraryHome: libraryHome,
  getLibrary: getLibrary,
  search: search,
  addItem: addItem,
  removeItem: removeItem,
  login: login,
  handleLogin: handleLogin,
  logout: logout,
  createUser: createUser
} //allows the above defined funtions to be used outside of this file