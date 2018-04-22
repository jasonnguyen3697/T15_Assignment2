//==============================================================Firebase Initialization=====================================================
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
//=============================================================Nodemailer Initialization====================================================
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
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

exports.SendSummary= functions.database.ref('/motionSensorData/').onWrite((snapshot, context) => {
    var Alldata = snapshot.after.val(); //Get the entire database object instead of the latest with onWrite.
    
    if (!snapshot.after.exists()){ //Since this function is run when the database is written (deleted,updated,pushed, etc.), dont send an email when the database is deleted.
        console.log('Database deleted so summary not sent');
        return null;
    }
    
    var TimestampArray=[];
    var StartTimeArray=[];
    var EndTimeArray=[];
    var MotionObject;
    var Databaselength=Object.keys(Alldata).length;
    if (Databaselength<5){ //If there are less than 5 objects on the database, send whatever is on there
        for (var i=1;i<Databaselength+1;i++){
            MotionObject=Alldata[Object.keys(Alldata)[Databaselength- i]]; //Get the last chronological object on the database
            TimestampArray.push(MotionObject.time_stamp); //Push the values of the object into an array
            StartTimeArray.push(MotionObject.starttime);
            EndTimeArray.push(MotionObject.endtime);    
        }
    }
    else{
        for (var j=1;j<6;j++){ //Get the latest 5 objects on the database
            MotionObject=Alldata[Object.keys(Alldata)[Databaselength - j]];
            TimestampArray.push(MotionObject.time_stamp);
            StartTimeArray.push(MotionObject.starttime);
            EndTimeArray.push(MotionObject.endtime);    
        }    
    }
    //Generate a string with a summary of the latest 5 objects
    var EmailBody='';
    for (var k=1;k<5;k++){
        EmailBody+=' \nMotion: ' + k + ' Timestamp: ' + TimestampArray[k-1] + ' Start Time: ' + StartTimeArray[k-1] + ' End Time: ' + EndTimeArray[k-1];        
    }
    console.log(EmailBody);
    return SendSummary(EmailBody);
});

function SendSummary(EmailBody){
    var mailOptions = {
            from: gmailEmail,
            to: 'ericrhorng@gmail.com', //Replace with pre-determined email
            subject: 'Motion Summary',
            text: EmailBody
    };
    
    return transporter.sendMail(mailOptions).then(() => { //Send email and return with promise
        return console.log('Summary sent Successfully');
    });
}