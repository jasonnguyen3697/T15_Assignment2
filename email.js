//====================================================GOOGLE FIREBASE INITIALIZATION (FROM WEEK 3 LAB)===========================================================
var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fit3140t15p1.firebaseio.com/"
});

var db = admin.database();
var ref = db.ref("/motionSensorData"); // channel name

//=============================================================SOCKETIO INITIALIZATION (FROM WEEK 2 LAB)==========================================================
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
