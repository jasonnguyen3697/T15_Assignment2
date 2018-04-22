//====================================================GOOGLE FIREBASE INITIALIZATION (FROM WEEK 3 LAB)===========================================================
var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fit3140t15p1.firebaseio.com/"
});

var db = admin.database();
var ref = db.ref("/motionSensorData"); // channel name

var nodemailer = require('nodemailer');

var t1 = 2.5;
var t2 = 5;
var idarray=[];
var starttimearray=[];
var endtimearray=[];
var timestamparray=[];


var mailOptions;

//When new data is uploaded
ref.on("child_added", function(snapshot) {
    var newentry = snapshot.val();
    var fivemail='These are the last five motions:'
    idarray.push(newentry.id);
    timestamparray.push(newentry.time_stamp);
    starttimearray.push(newentry.start_time); //Append to an array so it is easier to operate on instead of getting from database
    endtimearray.push(newentry.end_time);
    //Create email content to send
    if (timestamparray.length<5) {
      //If less than 5 motions have been recorded, only send the motions that have been recorded
      for (i=0;i<timestamparray.length;i++){
        fivemail+='\nMotion ';
        fivemail+=i;
        fivemail+=': Timestamp= ';
        fivemail+=timestamparray[i];
        fivemail+=', start time= ';
        fivemail+=starttimearray[i];
        fivemail+=', end time= ';
        fivemail+=endtimearray[i];
      }
    }
    else
    {
        //If 5 or more motions recorded, send five latest motions
        for (i=0;i<5;i++){
        fivemail+='\nMotion ';
        fivemail+=i;
        fivemail+=': Timestamp= ';
        fivemail+=timestamparray[timestamparray.length-6+i];
        fivemail+=', start time= ';
        fivemail+=starttimearray[starttimearray.length-6+i];
        fivemail+=', end time= ';
        fivemail+=endtimearray[endtimearray.length-6+i];
      }
    }
    console.log(timestamparray);
    var transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'fit3140.team15.s12018@gmail.com',
        pass: 'fit3140t15'
      },
      tls: {
        rejectUnauthorized:false
      }
    });
    var mailOptions;
    
        mailOptions = {
          from: 'fit3140.team15.s12018@gmail.com',
          to: 'fit3140.team15.s12018@gmail.com',
          subject: 'Last 5 motions',
          text: fivemail
        };
          transporter.sendMail(mailOptions, function(error, info){
          if (error) {
          console.log(error);
          } else {
          console.log('Email sent: ' + info.response);
        }
        
    });
    

    if (endtimearray[endtimearray.length-1]-starttimearray[starttimearray.length-1]>t1 && endtimearray[endtimearray.length-1]-starttimearray[starttimearray.length-1]<t2)
    {
      console.log('hi');
      mailOptions = {
        from: 'fit3140.team15.s12018@gmail.com',
        to: 'fit3140.team15.s12018@gmail.com',
        subject: 'Motion in threshold',
        text: 'The last motion at' + timestamparray[timestamparray.length-1] + 'was between ' + t1 +' and ' +t2
      };
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
      ref.remove();
    }

});
