/**********************************************************************
 * File: libraryModel.js
 * Author: Sam Gay
 * Date: 3/21/19
 * Purpose: handle data requests from server in regards to library
 * web app for class.
 **********************************************************************/

//Access db
const{Pool} = require('pg');
const express = require("express");
const app = express();
require('dotenv').config();

const dbConnection = process.env.DATABASE_URL;
const pool = new Pool({connectionString: dbConnection});

var bcrypt = require('bcrypt');

/////////////LIBRARY////////////////////////////////////
function getLibrary(callback){
  var sql = "SELECT id, title, sub_title, rating, genre, year, format, length FROM lib.library"; //TODO needs join...
  //var params = [username, h_password];

  pool.query(sql, function(err, result){
    if(err){

    }
    else {
    var results = {
                    success:true,
                    list:result.rows
                    };
    callback(null, results)
          }
  });

  // pool.query("SELECT id, title, sub-title, rating FROM lib.library", function(err, result){
  //   if(err){
  //     callback(err, null);
  //   }
  //   else {
  //     callback(null, results.rows);
  //       }
  // });

  // const libraryResults = [
  //   {id: 1, type: "Book", title: "Rainbow Six"},
  //   {id: 2, type: "DVD", title: "Braveheart"},
  //   {id: 3, type: "CD", title: "Awake"},
  //   {id: 4, type: "BR", title: "The Matrix"}
  // ]; //hard coded values instead of linking to db

  // callback(null, libraryResults);
}

//search
function search(item, callback){
  var sql = "SELECT id, title, sub-title, rating FROM lib.library WHERE item=$1::text";//TODO - likely need to join tables...
  var params = [item];

  // pool.query(sql, params, function(err, dbResults){
  //   if(err){
  //     throw err;
  //   }
  //   else {
  //     var results = {
  //       success: true,
  //       list: dbResults.rows
  //     };

  //     callback(null, results);
  //   }
  // });

  const searchResults = [
    {id: 1, type: "Book", title: "Rainbow Six"},
    {id: 2, type: "DVD", title: "Braveheart"},
    {id: 3, type: "CD", title: "Awake"},
    {id: 4, type: "BR", title: "The Matrix"}
  ]; //hard coded values instead of linking to db
  callback(null, searchResults);
}

//add
function addItem(item, callback){
  const sql = "INSERT INTO ";
  const params = [];

  var result = {
    success: true,
    item: "need to update..."
  };

  callback(null, result);
}

//remove
function removeItem(item, callback){
  var result = {
    success: true,
    item: "need to update..."
  };
}


///////////////////// USERS ////////////////////////////////
//login
function login(username, password, callback){
  const sql = "SELECT id, username, h_password name_first, name_last FROM lib.user";
  
  const params = [username, password];

  pool.query(sql, params, function(err, result){
    if (err) {
      console.log("Error with DB(login).");
      console.log(err);
      callback(err, null);
    }
    
  //   const user = result.rows[0];
  //   bcrypt.compare(password, user.h_password, function(err, res){
  //     if (res)
  //       callback(null, result.rows);
  //     else
  //       callback("No match", null);
  //   });
    callback(null, null);
   });
}


//createuser
function createUser(username, password, name_first, name_last, callback){
  
  bcrypt.hash(password, 10, (err, h_password) => {

    const sql = "INSERT INTO lib.user (username, h_password, name_first, name_last) VALUES ($1, $2, $3, $4) RETURNING id;";
    const params = [username, h_password, name_first, name_last];

    pool.query(sql, params, function(err, result){
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
  });
  
  

 
}


module.exports = {
  getLibrary: getLibrary,  
  search: search,
  addItem: addItem,
  removeItem: removeItem,
  createUser: createUser,
  login: login
};