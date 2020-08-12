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
// use middleware to perform functions        
function mware(req, res, next){
  // string is valid if it can be parsed by Date()
  let date = new Date(req.params.date_string); 
  
  // If there is no date_string then display the time right now
  if(!req.params.date_string){
    req.utc = new Date().toString();
    req.unix = Date.parse(req.utc);
  } 
  
  // If the date_string does not include a dash (-) then it's unix time format
  else if(!req.params.date_string.match(/-/)){
    req.unix = req.params.date_string;
    let utc = new Date(parseInt(req.params.date_string));
    req.utc = utc.toUTCString();
  } 
  
  // string is valid if it can be parsed
  else if(date == 'Invalid Date'){
    req.err = date;
  } 
  
  // if no other cases have been activated then the string is valid
  else { 
    // parse date_string into unix format
    req.unix = Date.parse(date);
    // turn date into UTC
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
