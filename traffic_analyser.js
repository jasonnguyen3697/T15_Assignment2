//Make connection
var io = require('socket.io-client');
var socket = io.connect('http://localhost:8080', {reconnect: true});

//GOOGLE FIREBASE INITIALIZATION
var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fit3140t15p1.firebaseio.com/"  // IMPORTANT: repalce the url with yours
});

var db = admin.database();
var ref = db.ref("/motionSensorData"); // channel name

//background variables for logic
var long = 0;
var short = 0;
var threshold = 500;
var sensorStatus = "NNNN"; //initialises to 4 nonsense letters and update until we get LSLL
var numVisitor = 0;

//variables from html file
var longMsg = document.getElementById('longMsg');
var shortMsg = document.getElementById('shortMsg');
var visitor = document.getElementById('visitor');
var reset = document.getElementById('reset');
var led = document.getElememntById('LEDtoggle');
var sensor = document.getElementById('Sensortoggle');

ref.on("child_added", function(snapshot){
  var value = snapshot.val();
  var time = value.time * 1000;
  /*console.log("Id: " + value.id);
  console.log("Time: " + value.time);*/
  if (time > threshold)
  {
    long++;
    longMsg.innerHTML = "GOT SOMETHING";
    //longMsg.innerHTML += long;
    sensorStatus = sensorStatus.splice(1, 4);
    sensorStatus += "L";
  }
  else {
    short++;
    shortMsg.innerHTML = "GOT SOMETHING";
    //shortMsg.innerHTML += short;
    sensorStatus = sensorStatus.splice(1, 4);
    sensorStatus += "S";
  }
  if (sensorStatus=="LSLL")
  {
    numVisitor++;
    visitor.innerHTML = "GOT SOMETHING";
    //visotr.innerHTML += numVisitor;
  }
});

reset.addEventListener('click', function(){
  socket.emit('reset');
  long = 0;
  short = 0;
  numVisitor = 0;
  visitor.innerHTML = "Number of visitors: ";
  visotr.innerHTML += numVisitor;
  longMsg.innerHTML = "Number of long messages: ";
  longMsg += long;
  shortMsg.innerHTML = "Number of short messages: ";
  shortMsg.innerHTML += short;
  sensorStatus = "NNNN";
});

led.addEventListener('click', function(){
  socket.emit('ledchange');
});

sensor.addEventListener('click',function(){
  socket.emit('sensorchange');
});
