//GOOGLE FIREBASE INITIALIZATION
var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fit3140t15p1.firebaseio.com/"  // IMPORTANT: repalce the url with yours
});

var db = admin.database();
var ref = db.ref("/motionSensorData"); // channel name

ref.push({
                id:1,
                time:6
            });

ref.push({
                id:2,
                time:1
            });

ref.push({
                id:3,
                time:6
            });