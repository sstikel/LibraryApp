/***************************************
 * File: dbAccess.js
 * Author: Sam Gay
 * Date: 3/16/19
 * Purpose: Access library db at heroku
 ***************************************/

var express = require('express');
var router = express.Router();

//pg config
var pg = require('pg');
var conString = 'postgres://@localhost/pg_demo_db';


module.exports = router;