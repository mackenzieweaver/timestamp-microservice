// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

// Timestamp Microservice
app.get('/api/timestamp/:date_string?', 
function mware(req, res, next){
  let date = new Date(req.params.date_string);
  if(!req.params.date_string){
    req.utc = new Date().toString();
    req.unix = Date.parse(req.utc);
  } else if(req.params.date_string.split('').length > 10){
    req.unix = req.params.date_string;
    let utc = new Date(parseInt(req.params.date_string));
    req.utc = utc.toUTCString();
  } else if(date == 'Invalid Date'){
    req.err = date;
  } else {
    let date = new Date(req.params.date_string);
    req.unix = Date.parse(date);
    req.utc = date.toUTCString();
  }
  next();
}, 
function handler (req, res){
  if(req.err){
    res.json({"error" : "Invalid Date" });
  } else {
    res.json({unix: req.unix, utc: req.utc});    
  }  
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
