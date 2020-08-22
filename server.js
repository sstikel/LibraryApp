/***
 * Doc: server.js
 * Author: Sam Gay
 * Date: 10/22/19
 * Purpose: Manage requests for library items. Includes uploading info, deleting info, retrieving info, 
 * adding and modifying users, etc.
 * 
 */

const http = require("http");
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const{Pool} = require('pg');
//Pool -- https://node-postgres.com/api/pool
//const pgDB = require("pg");
const bcrypt = require('bcrypt');
// bcrypt -- https://www.npmjs.com/package/bcrypt
require('dotenv').config();

var app = express();
app.use(bodyParser.json());
const dbConnection = process.env.DATABASE_URL;
const pool = new Pool({connectionString: dbConnection});
app.set("views", "views");
app.set("view engine", "ejs");
app.use(express.static("public")); //let all files in 'public' be used anyways

require('es6-promise').polyfill();
const fetch = require('isomorphic-fetch');

////session////
//https://codeforgeek.com/manage-session-using-node-js-express-4/
app.use(require('morgan')('dev'));
const session = require('express-session');
//express-session -- https://www.npmjs.com/package/express-session
const FileStore = require('session-file-store')(session);
app.use(session({
  name: 'server-session-cookie-id',
  secret: 'my express secret',
  saveUninitialized: false,
  resave: true,
  store: new FileStore()}));
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());

const port = process.env.PORT || 5000; //checks for heroku port OR use 5000
console.log("Server on port: " + port);
//end

//Homepage from CS313
app.get("/home", function(req, res){
  res.redirect("home.html");
});

//Test Page for Library App
app.get("/testPage", (req, res) => {
  res.redirect("testWebpage.html")
});

//////////////////////////////  LIBRARY API //////////////////////////////
//GET//

//Request format to: https://isbndb.com/apidocs/v2
//Base URL: api2.isbndb.com
//GET https://api2.isbndb.com/books/the%20hunt%20for%20red%20october?page=2&pageSize=20&beta=0
//--------------------------------
//GET /book/9780134093413 HTTP/1.1
//Host: api2.isbndb.com
//User-Agent: insomnia/5.12.4
//Authorization: YOUR_REST_KEY
//Accept: */*
//--------------------------------
/*
let headers = {
  "Content-Type": 'application/json',
  "Authorization": 'YOUR_REST_KEY'
}

fetch('https://api2.isbndb.com/book/9781934759486', {headers: headers})
  .then(response =&gt; {
      return response.json();
  })
  .then(json =&gt; {
      console.log(json)
  })
  .catch(error =&gt; {
      console.error('Error:', error)
  });
*/


//return full library
app.get("/api/book", async (req, res) => {
  try{
    console.log("return full library reached.");
    let sess;
    //TODO - sanatize input

    //verify login info
    if(req.session){
       sess = req.session.token; 
    }
    else{
      res.send("Please log in.");
    }
    
    //query db for items
    let sql = "SELECT lib.library.title, lib.library.sub_title, lib.library.author, lib.library.year, lib.library.isbn, lib.lookup.qty " +
              "FROM lib.library LEFT JOIN lib.lookup ON (lib.lookup.item_id = lib.library.id)" +
              "WHERE user_id = " + sess + ";"; //Verified - works

    const result = await pool.query(sql);
    let json = JSON.stringify(result);
    //return result
      res.send(json);
  }
  catch(err){
    console.error(err);
    console.log(err);
    res.send("Error: " + err); //TODO - edit response for presentation to user
  }
});



//return specific library item
app.get("/api/book/:id", async (req, res) => {
  try{
    let sess;

    //verify login info
    if(req.session)
      sess = req.session.token;
    else{
      res.send("Please log in.");
    }
    //TODO - sanitize input

    //request item info from external api
    let isbn = req.params.id; //extract from url
    let apiURL = 'https://api2.isbndb.com/book/';
    let data;
    
    let headers = {
      "Content-Type": 'application/json',
      "Authorization": 'YOUR_REST_KEY'
    }
    
    //TODO - 'explicit deny' problem with external API
    fetch(apiURL + isbn, {headers: headers})
      .then(response => {
          return response.json();
      })
      .then(json => {
          console.log("ex API json:");
          console.log(json);
          data = json;
      })
      .catch(error => {
          console.error('Error:', error)
      }); //credit: https://isbndb.com/apidocs/v2

      //return result
      res.send(data);
    }
  catch(err){
    console.error(err);
    console.log(err);
    res.send("Error: " + err); //TODO - edit response for presentation to user
  }
});


//return general search for specific item
app.post("/api/book/search", async (req, res) => {
    //TODO - request item search results from external api
    //TODO - query db for item search results in user library
    //TODO - return result
    try{
    let sess;

    //verify login info
    if(req.session)
      sess = req.session.token;
    else{
      res.send("Please log in.");
    }
    //TODO - sanitize input

    //request item info from external api
    let input = req.body;
    let apiURL = 'https://api2.isbndb.com/search/books?';
    let data;

    //TODO - parse search request
    let author;
    let title;

    if(input.author){
      author = encodeURIComponent(input.author.trim());
    }
    if(input.title){
      title = encodeURIComponent(input.title.trim());
    }
    if(author && title){
      apiURL += "author=" + author;
      apiURL += "&";
      apiURL +="text=" + title;
    }
    else{
      res.send("No search info inputted.")
    }


    let headers = {
      "Content-Type": 'application/json',
      "Authorization": 'YOUR_REST_KEY'
    }
    
    //TODO - 'explicit deny' problem with external API
    fetch(apiURL, {headers: headers})
      .then(response => {
          return response.json();
      })
      .then(json => {
          console.log("ex API json:");
          console.log(json);
          data = json;
      })
      .catch(error => {
          console.error('Error:', error)
      }); //credit: https://isbndb.com/apidocs/v2

      //return result
      res.send(data);
    }
  catch(err){
    console.error(err);
    console.log(err);
    res.send("Error: " + err); //TODO - edit response for presentation to user
  }
});


//TODO - /api/movie
//TODO - /api/movie/:id
//TODO - /api/movie/:param

//END GET//

/* Not really needed if using PUT similarly.
//POST//
//create library item
app.post("/api/item", async (req, res) => {
  try{
    //TODO - verify login info
    //TODO - sanitize input
    //TODO - query db
      //- check if item exists; if not, add to library table
        //- request proper info from external API
      //- create row in composite key table; include user PK and item PK
    //TODO - return result
  }
  catch(err){

  }
});
//END POST//
*/

//PUT//
/*
//create library item
//update quantity of user item
app.put("/api/item/:id", async (req, res) => {
  try{
    //verify login info
    if(req.session)
      let sess = req.session.cookie.path;
    else{
      res.send("Please log in.")
      break;
    }
    //TODO - sanitize input

    //query db: 
    let isbn = req.session.token; //???
    let sql = "SELECT title, isbn FROM lib.library WHERE isbn = "  + isbn + ";";
    let result = pool.query(sql);
    //if item not in db
    if(!result){
        //request item data from external api
        let apiURL = 'https://api2.isbndb.com/book/';
        
        let headers = {
          "Content-Type": 'application/json',
          "Authorization": 'YOUR_REST_KEY'
        }
        
        let result = await fetch(apiURL + isbn + "?with_prices=0", {headers: headers})
          .then(response => {
              return response.json();
          })
          .then(json => {
              //console.log(json)
          })
          .catch(error => {
              console.error('Error:', error)
          }); //credit: https://isbndb.com/apidocs/v2
        
        let format;
        if(result.format == "book"){
          //Check what type of 'format' is returned by ex. api
          format = 1;
        }
        else
          format = 2;

        let params = [result.title, result.title_long, result.authors[0], result.date_published, format, isbn];

        //add to db item data: title, sub_title, author, year, isbn, format
        sql = "INSERT INTO lib.library(title, sub_title, author, year, format, isbn)" +
              "VALUES($1, $2, $3, $4, $5, $6)" + ";";
        pool.query(sql, params, (err, result) => {
          if (err){
            console.log("Error while inserting into DB...");
            console.log(err);
      
            callback(err, null);
          }
          else {
            console.log("DB insert complete...");
            console.log(result.rows);
      
            callback(null, result.rows);
          }
        });
        
      }
    //update user quantity
    sql = "SELECT id FROM lib.library WHERE lib.library.isbn = " + isbn + ";";
    let libID = await pool.query(sql);
    sql = "UPDATE lib.lookup SET lib.lookup.qty = lib.lookup.qty + 1" 
          "WHERE lib.lookup.user_id = " + sess + " AND lib.lookup.item_id = " + libID + ";";

    pool.query(sql, (err, result) => {
      //return result
      if(err){
        console.log("Error while inserting into DB...");
        console.log(err);
        res.send("Error updating quantity.")
      }
      else{
        console.log("DB insert complete...");
        console.log(result.rows);
        res.send("Quantity updated.")
      }
    });
  }
  catch(err){
    console.error(err);
    console.log(err);
    res.send("Error: " + err); //TODO - edit response for presentation to user
  }
});
*/
//END PUT//

//DELETE//
/*
//delete library item
app.delete("/api/item/:id", async (req, res) => {
  try{
    //TODO - verify login info
    if(req.session){
      let sess = req.session.cookie.path;
      let isbn = req.session.cookie.path;
    }
    else{
      res.send("Please log in.")
      break;
    }
    //TODO - sanitize input

    //query db: delete user's item row in composite key table
    //check if user row exists
    let sql = "SELECT lib.library.id, lib.lookup.qty" + 
              "FROM lib.lookup" + 
              "INNER JOIN lib.library ON lib.lookup .item_id = lib.library.id" + 
              "WHERE isbn = " + isbn + " AND user_id = " + sess + ";";
    let result = pool.query(sql);
    //decrement
    if(result[1] > 0){
      sql = "UPDATE lib.lookup" + 
            "SET qty = qty - 1" +
            "WHERE user_id = " + sess + "AND item_id = " + result[0] + ";";

      //if decrements to zero, delete row
      if(result[1] - 1 == 0){
        sql = "DELETE FROM lib.lookup" +
              "WHERE user_id = " + sess + "AND item_id = " + result[0] + ";";
      }

      pool.query(sql);
    }
      
    //return result
    res.send("Deletion succesful.")
  }
  catch(err){
    console.error(err);
    console.log(err);
    res.send("Error: " + err); //TODO - edit response for presentation to user 
  }
});
*/
//END DELETE//

////  END LIBRARY API ////
//////////////////// USERS /////////////////////////////////////////
//login
app.post("/api/user/login", async (req, res) => {
  try{
    //retrieve login info from req
    let sess = req.session;
    let userData = req.body;
    console.log("userData:");
    console.log(userData);
    //TODO - sanitize user input
    //query db 
    let username = userData.username;
    let password = userData.password;
    let h_password;
    let userID;

    //TODO - uncomment when deploying
    /*
    let sql = 'SELECT id, h_password FROM lib.user WHERE username=' + username;
    pool.query(sql, username, (err, result) => {
      if(err){
        console.log("Error with DB(login/username)");
        console.log(err);
      }    
      else{
        //TODO - iterate through all results
              //may have more than one username that matches
        h_password = result.rows[0].h_password; //TODO - error here, not connecting to db while debugging
        userID = result.rows[0].id;
      }
      */
     //TODO - remove hashed password
      h_password = "$2b$10$uQRzM87mk89yHII79OjcGurxq866fmcA8FfWS3j6HeWNmRw6lY7F";

        //compare hashed passwords
        let match = bcrypt.compare(password, h_password);
        if(match){
          //set cookie
          userID = 8; //TODO - remove, hard coded debug value
          sess.token = userID;
          //return result
          res.send("User Authenticated.");
        }
        else
          res.send("Login info incorrect.")   
    //});    
  }
  catch (err){
    console.log("Error with API login");
    console.log(err);
  }
});
//end login

//logout
app.get("/api/user/logout", async (req, res) => {
  try{
    //deauthorize cookie/token/etc.
    let sess = req.session;
    sess.destroy((err) => {
      if(err){
        console.log("error with API logout: " + err);
        return "An error has occured in Logout.";
      }
    });
    //TODO - return result (logout confirmation)
    res.send("Logout complete");
  }
  catch(err){
    console.log("Error with API logout");
    console.log(err);
  }
});
//end logout
//create user
app.post("/api/user/newuser", async (req, res) => {
  try{
    var hash = "";
    //TODO - sanatize input
    let input = req.body;
    let username = input.username;
    let password = input.password;
    let name_first = input.fName;
    let name_last = input.lName;
    let h_password;

    //query db -- store username, h_password, first and last names
    bcrypt.hash(password, 10, (err, h_password) => {
      const sql = "INSERT INTO lib.user (username, h_password, name_first, name_last) VALUES ($1, $2, $3, $4);";
      const params = [username, h_password, name_first, name_last];
  
      pool.query(sql, params, (err, result) => {
        if (err){
          console.log("Error inserting new user into DB.");
          console.log(err);
        }
        else {
          res.send("User Created.")
        }
      });
    });
  }
  catch(err){
    console.log("Error with new user on API");
    console.log(err);
    res.send("Error creating new user;")
  }
});
//end create user
//////////////////// END USERS /////////////////////////////////////////

////////////////////// LISTENER ////////////////////////////
app.listen(port, function () {
  console.log("Listening on port : " + port);
});
////////////////////// END LISTENER ////////////////////////////

/////////////////////functions///////////////////////////


