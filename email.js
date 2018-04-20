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
var nodemailer = require('nodemailer');
var io = socket(server);
var t1;
var t2;
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'fit3140.team15.s12018@gmail.com',
    pass: 'fit3140t15'
  }
});
var mailOptions;



ref.on("child_added", function(snapshot) {
    var newentry = snapshot.val();
    idarray.push(newentry.id);
    starttimearray.push(newentry.start_time); //Append to an array so it is easier to operate on instead of getting from database
    endtimearray.push(newentry.end_time);
    console.log(timearray);
    mailOptions = {
      from: 'fit3140.team15.s12018@gmail.com',
      to: 'myfriend@yahoo.com',
      subject: 'Last 5 motions',
      text: 'These are the last five motions: '
    };
      transporter.sendMail(mailOptions, function(error, info){
      if (error) {
      console.log(error);
      } else {
      console.log('Email sent: ' + info.response);
    }
    mailOptions = {
      from: 'fit3140.team15.s12018@gmail.com',
      to: 'myfriend@yahoo.com',
      subject: 'Motion in threshold',
      text: 'The last motion was between {{t1}} and {{t2}}'
    };
    if (endtimearray[endtimearray.length-1]-starttimearray[starttimearray.length-1]>t1 && endtimearray[endtimearray.length-1]-starttimearray[starttimearray.length-1]<t2)
    {
      transporter.sendMail(mailOptions, function(error, info){
      if (error) {
      console.log(error);
      } else {
      console.log('Email sent: ' + info.response);
    }
});
    }
    else if (endtimearray[endtimearray.length-1]-starttimearray[starttimearray.length-1]>t2)
    {
      iosocket.emit('reset');
    }

});
