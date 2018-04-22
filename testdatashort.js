//GOOGLE FIREBASE INITIALIZATION
var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fit3140t15p1.firebaseio.com/"  // IMPORTANT: repalce the url with yours
});

var db = admin.database();
var ref = db.ref("/motionSensorData"); // channel name

var starttime = 0;
var endtime;
var timestamp= new Date();
for (var i=0;i<1;i++)
{
  starttime = 1000; //1 second duration
  endtime = 2000;
    
  ref.push({
    starttime: starttime,
    endtime: endtime,
    time_stamp: timestamp.toUTCString()
  });   

}

//var jkjk={hello:{aloha:1,chocolate:5},mrric:{aloha:100,chocolate:99}};
//console.log(Object.keys(jkjk));   
//console.log(jkjk[Object.keys(jkjk)[Object.keys(jkjk).length - 2]]);

