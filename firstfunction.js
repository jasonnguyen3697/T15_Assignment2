//========================================================================Firebase Initialization======================================================
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
//==================================================================NodeMailer Initialization===========================================================
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
            user: gmailEmail,
            pass: gmailPassword
            },
        tlc:{
            rejectUnauthorized:false
        }
});

exports.SendEmail = functions.database.ref('/motionSensorData/{pushId}').onCreate((snapshot, context) => {
    var data = snapshot.val(); //Get the latest data object pushed onto the database
    var t1 = 2.5;
    var t2 = 5;
    var duration=(data.endtime-data.starttime)/1000;
    
    //If between the duration, send an email to the email address
    if (duration>t1 && duration<t2){
        console.log('Valid duration')
        return SendLatestTime(t1,t2);
    }
    return console.log('Duration not within interval');
});

function SendLatestTime(t1,t2){
    var mailOptions = {
            from: gmailEmail,
            to: 'ericrhorng@gmail.com',
            subject: 'Motion in threshold',
            text: 'The motion duration was between ' + t1 + ' and ' +t2
    };
    
    return transporter.sendMail(mailOptions).then(() => { //Send email, return with promise
        return console.log('Email sent Successfully');
    });
}
