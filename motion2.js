//GOOGLE FIREBASE INITIALIZATION
var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fit3140t15p1.firebaseio.com/"  // IMPORTANT: repalce the url with yours
});

var db = admin.database();
var ref = db.ref("/motionSensorData"); // channel name
var idarray=[];
var timearray=[];
var databaselength=0; //Need to reset this to 0 when database is reset

ref.on("child_added", function(snapshot) {
    var newentry = snapshot.val();
    console.log("Id: " + newentry.id);
    idarray.push(newentry.id);
    console.log("Time: " + newentry.time);
    timearray.push(newentry.time);
    databaselength+=1;
});


//SOCKETIO INITIALIZATION
var fs =require('fs')
         , http=require('http')
         , socket=require('socket.io');

var server=http.createServer(function(req, res) {
            res.writeHead(200, { 'Content-type': 'text/html'});
            res.end(fs.readFileSync(__dirname+'/index.html'));
            }).listen(8080, function() {
            console.log('Listening at: http://localhost:8080');
 });

 var io = socket(server);

//ARDUINO CODE
var five = require("johnny-five");
var board = new five.Board();

//Global variables
var starttime=0;
var endtime=0;
var threshold=500;
var offset=1000*3.7;
var sensoron=1;
var ledstate= true;


board.on("ready", function() {

  var motion = new five.Motion(8);
  var led = new five.Led(13);

  motion.on("calibrated", function() {
      console.log("SENSOR IS WORKING");
      console.log(idarray);
      console.log(timearray);

  });

  motion.on("motionstart", function() {
      if (sensoron){
          starttime=new Date().getTime();
          console.log("Motion Start at " + starttime);
          //led.on();
      }
  });

  motion.on("motionend", function() {
      if (sensoron){
          endtime=new Date().getTime();
          console.log("Motion lasted : " + (endtime-starttime-offset)/1000);

          if ((endtime-starttime-offset)>threshold){
              ref.push({
                  id:databaselength,
                  time:(endtime-starttime-offset)/1000//Get time of motion in seconds
              });
          }
          //led.off();
          //led.toggle();
      }
  });
});

io.listen(server).on('connection', function (socket) {
    console.log('User Connected')
    
    socket.on('sensorchange', function(){
      if (sensoron){
          sensoron=0;
          socket.emit('Sensoroff');
          console.log('Sensor turned off');
      }
      else{
          sensoron=1;
          socket.emit('Sensoron');
          console.log('Sensor turned on');
      }
    });

    socket.on('ledchange', function(){
      if (ledstate){
          ledstate=false;
          socket.emit('LEDoff');
          console.log('LED turned off');
      }
      else{
          ledstate=true;
          socket.emit('LEDon');
          console.log('LED turned off');
      }
    });

    socket.on('reset', function(){
      ref.remove()
          .then(function() {
            idarray=[];
            timearray=[];
            console.log("Database cleared");

      });
    });
  });
