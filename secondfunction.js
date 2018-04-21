const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

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

exports.SendSummary= functions.database.ref('/motionSensorData/').onCreate((snapshot, context) => {
    var Alldata = snapshot.val();
    var TimestampArray=[];
    var StartTimeArray=[];
    var EndTimeArray=[];
    if (Object.keys(Alldata).length<5){
        for (var i=1;i<Object.keys(Alldata).length+1;i++){
            MotionObject=Alldata[Object.keys(Alldata)[Object.keys(Alldata).length - i]];
            console.log(MotionObject);
            TimestampArray.push(MotionObject.time_stamp);
            StartTimeArray.push(MotionObject.starttime);
            EndTimeArray.push(MotionObject.endtime);    
        }
    }
    else{
        for (var i=1;i<6;i++){
            MotionObject=Alldata[Object.keys(Alldata)[Object.keys(Alldata).length - i]];
            console.log(MotionObject);
            TimestampArray.push(MotionObject.time_stamp);
            StartTimeArray.push(MotionObject.starttime);
            EndTimeArray.push(MotionObject.endtime);    
        }    
    }
    var EmailBody='';
    for (i=0;i<TimestampArray.length,i++){
    EmailBody+=' \nMotion Timestamp: ' + TimestampArray[i] + ' Start Time: ' + StartTimeArray[i] + ' End Time: ' + EndTimeArray[i];     
        
    }
    
    return SendSummary(EmailBody);
    
});

function SendSummary(EmailBody){
    var mailOptions = {
            from: gmailEmail,
            to: 'proneuronix@gmail.com',
            subject: 'Motion Summary',
            text: EmailBody
    };
    
    return transporter.sendMail(mailOptions).then(() => {
        return console.log('Summary sent Successfully');
    });
}
