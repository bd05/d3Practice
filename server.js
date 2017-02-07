// modules =================================================
var express        = require('express');
var app            = express();
var path = require('path');

// configuration ===========================================
var port = process.env.PORT || 8080; 

app.use(express.static('public'))

// routes ==================================================
var router = express.Router(); 

// start app ===============================================
// start app at http://localhost:8080
app.listen(port);                               
console.log('port started on: ' + port);

