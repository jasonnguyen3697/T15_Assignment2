//====================================================GOOGLE FIREBASE INITIALIZATION (FROM WEEK 3 LAB)===========================================================
var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fit3140t15p1.firebaseio.com/"
});

var db = admin.database();
var ref = db.ref("/motionSensorData"); // channel name


//====================================================================ARDUINO CODE===============================================================================
var five = require("johnny-five");
var board = new five.Board();

//Global variables
var starttime=0;
var endtime=0;
var ledstate=0;
var lednewperson=0; //New person flag
var idarray=[];
var timearray=[];
var newdata=0;
var ledcounter=0;

//Thresholds
var offset=1000*3; //Offset when physical motion ends and Arduino motion ends
var threshold=3; //Threshold between long and short motions

//LED/Sensor Enable
var ledon=1;
var sensoron=1;

board.on("ready", function() {

  var motion = new five.Motion(8);
  var led = new five.Led(13);

  motion.on("calibrated", function() {
      console.log("SENSOR IS WORKING");
      newdata=1; //To differentiate between old data already on the database so LED does not light up
  });

  motion.on("motionstart", function() {
      if (sensoron){ //Sensor toggle using socketio
          timestamp=new Date();
          starttime=new Date().getTime();
          console.log("Motion Start at " + starttime);
      }
  });

  motion.on("motionend", function() {
      if (sensoron){
          endtime=new Date().getTime();
          var timeelapsed= (endtime-starttime-offset)/1000 //An offset is used to account for the time it takes for the motion pin to go low
          console.log("Motion lasted : " + timeelapsed);
          if ((endtime-starttime-offset)>0){  //Remove negative times
            endtime = endtime - offset
            ref.push({ //Push to Google Firebase
                id:timearray.length,
                start_time: starttime,
                end_time: endtime,
                time_stamp: timestamp,
            });
          }
      }
  });

ref.on("child_added", function(snapshot) {
    var newentry = snapshot.val();
    idarray.push(newentry.id);
    timearray.push(newentry.time); //Append to an array so it is easier to operate on instead of getting from database
    console.log(timearray);
    if (timearray[timearray.length-1]>threshold && timearray[timearray.length-2]>threshold && timearray[timearray.length-3]<threshold && timearray[timearray.length-4]>threshold){ //Check if new person detected
        if (newdata){
            if (!ledstate){ //If LED is not already on (i.e. someone new is entering the corridor), turn LED on
                console.log('New person detected');
                ledstate=1;
                led.strobe(1,CheckLEDState); //Non-blocking way of turning LED on using callback function CheckLEDState (called every time LED is off/on)
            }
            else if(ledstate){ //If someone is already in corridor, (LED is on) extend LED illumination by 5 seconds using lednewperson flag
                console.log('Extending LED');
                lednewperson=1;
            }
        }
    }

});


                if (lednewperson){ //Check lednewperson flag every iteration to decide whether to extend illumination by 5 seconds
                    lednewperson=0;
                    console.log('On for 5 seconds')
                    ledcounter-=3222; //Around 5 seconds
                }
                ledcounter+=1; //LED counter should increment by the same amount every time (around 1 millisecond), so we can use it to time how long the LED is on
            }
        }
        else{
            led.stop().off();
            ledcounter=0;
        }
    }
});
