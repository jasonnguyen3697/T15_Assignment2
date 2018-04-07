//GOOGLE FIREBASE INITIALIZATION
var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");
var express = require("express");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fit3140t15p1.firebaseio.com/"  // IMPORTANT: repalce the url with yours
});
var app = express();
app.use(express.static('public'));

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

 io.on('connection', function(socket){
   console.log("Device connected: " + socket.id);
 });
