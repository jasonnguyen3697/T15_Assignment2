//====================================================GOOGLE FIREBASE INITIALIZATION======================================================================
var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fit3140t15p1.firebaseio.com/"  // IMPORTANT: repalce the url with yours
});

var db = admin.database();
var ref = db.ref("/motionSensorData"); // channel name

//=============================================================SOCKETIO INITIALIZATION===========================================================================
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

//====================================================================ARDUINO CODE===============================================================================
var five = require("johnny-five");
var board = new five.Board();

//Global variables
var starttime=0;
var endtime=0;
var ledstate=0;
var lednewperson=0;
var idarray=[];
var timearray=[];
var newdata=0;
var ledcounter=0;

//Thresholds
var offset=1000*3;
var threshold=3;

//LED/Sensor Enable
var ledon=1;
var sensoron=1;

board.on("ready", function() {

  var motion = new five.Motion(8);
  var led = new five.Led(13);

  motion.on("calibrated", function() {
      console.log("SENSOR IS WORKING");
      newdata=1;
  });

  motion.on("motionstart", function() {
      if (sensoron){
          starttime=new Date().getTime();
          console.log("Motion Start at " + starttime);
      }
  });

  motion.on("motionend", function() {
      if (sensoron){
          endtime=new Date().getTime();
          var timeelapsed= (endtime-starttime-offset)/1000
          console.log("Motion lasted : " + timeelapsed);
          if ((endtime-starttime-offset)>0){  
            ref.push({
                id:timearray.length,
                time:timeelapsed
            });
          }
      }
  });
        
//========================================================================SOCKETIO CODE===================================================================================
    
ref.on("child_added", function(snapshot) {
    var newentry = snapshot.val();
    idarray.push(newentry.id);
    timearray.push(newentry.time);
    console.log(timearray);
    if (timearray[timearray.length-1]>threshold && timearray[timearray.length-2]>threshold && timearray[timearray.length-3]<threshold && timearray[timearray.length-4]>threshold){
        if (newdata){
            if (!ledstate){
                console.log('New person detected');
                ledstate=1;
                led.strobe(0.05,CheckLEDState);    
            }
            else if(ledstate){
                console.log('Extending LED');
                lednewperson=1;
            }
        }    
    }
    
});

io.listen(server).on('connection', function (socket) {
    console.log('User Connected')
    
    socket.on('sensorchange', function(){
      if (sensoron){
          sensoron=0;
          starttime=0;
          endtime=0;
          socket.emit('Message','Sensor Disabled');
          console.log('Sensor Disabled');
      }
      else{
          sensoron=1;
          socket.emit('Message', 'Sensor Enabled');
          console.log('Sensor Enabled');
      }
    });

    socket.on('ledchange', function(){
      if (ledon){
          ledstate=0;
          ledcounter=0;
          led.off().stop();
          ledon=0;
          socket.emit('Message','LED Disabled');
          console.log('LED Disabled');
      }
      else{
          ledon=1;
          socket.emit('Message','LED Enabled');
          console.log('LED Enabled');
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
    
    socket.on('msg',function(msg){
        console.log(msg);    
    });
  });
    
    function CheckLEDState(){
        if (ledon){
            if (ledstate && ledcounter>15000){
                console.log('Stopped LED');
                ledcounter=0;
                ledstate=0;
                led.stop().off();
            }
            else{
                if (lednewperson){
                    lednewperson=0;
                    console.log('On for 5 seconds')
                    ledcounter-=5000;
                }
                ledcounter+=1;
            }   
        }
        else{
            led.stop().off();
            ledcounter=0;
        }
    }    
});
