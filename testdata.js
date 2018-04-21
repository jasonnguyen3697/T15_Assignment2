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
  //timestamp = new Date();
  starttime = 4
  endtime = 5
    
  ref.push({
    starttime: starttime,
    endtime: endtime,
    time_stamp: timestamp.toUTCString()
  });   

}

//var jkjk={hello:{aloha:1,chocolate:5},mrric:{aloha:100,chocolate:99}};
//console.log(Object.keys(jkjk));
//console.log(jkjk[Object.keys(jkjk)[Object.keys(jkjk).length - 2]]);

