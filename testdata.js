//GOOGLE FIREBASE INITIALIZATION
var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");
var randomNumber = require("random-number-between");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fit3140t15p1.firebaseio.com/"  // IMPORTANT: repalce the url with yours
});

var db = admin.database();
var ref = db.ref("/motionSensorData"); // channel name

var starttime = 0;
var endtime;
var timestamp;

starttime = randomNumber(starttime * 1000 + 7500, starttime * 1000 + 1000, 1)/1000;
console.log(randomNumber(1, 10));

for (i=0;i<15;i++)
{
  timestamp = new Date();
  starttime = randomNumber(starttime * 1000 + 7500, starttime * 1000 + 1000)/1000;
  endtime = randomNumber(starttime*1000+500, (starttime*1000)+8000)/1000;
  ref.push({
    id:1,
    start_time: starttime,
    end_time: endtime,
    time_stamp: timestamp
  });
  starttime = starttime + 7.5;
}
