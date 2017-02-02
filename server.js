// modules =================================================
var express        = require('express');
var app            = express();
var path = require('path');

// configuration ===========================================
var port = process.env.PORT || 8080; 

// set the static files location 
//app.use(express.static(__dirname + '/public')); 
app.use(express.static('public'))
/* app.get('/index.htm', function (req, res) {
    res.sendFile( __dirname + "/" + "index.html" );
 })
 */

// routes ==================================================
var router = express.Router(); 

// start app ===============================================
// start app at http://localhost:8080
app.listen(port);                               
console.log('port started on: ' + port);

