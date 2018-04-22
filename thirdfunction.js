const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.DeleteifLarger = functions.database.ref('/motionSensorData/{pushId}').onCreate((snapshot, context) => {
    var data = snapshot.val();
    var t1 = 2.5;
    var t2 = 5;
    var duration=(data.endtime-data.starttime)/1000;
    
    if (duration>t2){       
        return admin.database().ref().remove(); //Delete database similar to previous assignment
    }
    
    return console.log('Duration not within interval');
});