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

/*
ref.on("value", function(snapshot) {   //this callback will be invoked with each new object
    var newentry=snapshot.val();
    console.log(newentry.id);
    console.log(newentry.time);
    
    //console.log(snapshot.val());         // How to retrive the new added object
    
    }, function (errorObject) {             // if error
        console.log("The read failed: " + errorObject.code);
});
*/


ref.on("child_added", function(snapshot) {
    var newentry = snapshot.val();
    console.log("Id: " + newentry.id);
    idarray.push(newentry.id);
    console.log("Time: " + newentry.time);
    timearray.push(newentry.time);
    databaselength+=1;
});


//ARDUINO CODE
var five = require("johnny-five");
var board = new five.Board();

var starttime=0;
var endtime=0;
var threshold=500;
var offset=1000*3.7;
var sensoron=1;


board.on("ready", function() {
    var led = new five.Led(13);
    var motion = new five.Motion(8);

    motion.on("calibrated", function() {
        console.log("SENSOR IS WORKING");
        console.log(idarray);
        console.log(timearray);
    
    });
    
    motion.on("motionstart", function() {
        if (sensoron){
            starttime=new Date().getTime();
            console.log("Motion Start at " + starttime);
            led.on();    
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
            led.off();    
        }
    });
});