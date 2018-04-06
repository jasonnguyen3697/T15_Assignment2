//Make connection
var socket = io.connect('http://localhost:8080', {reconnect: true});
var ref = firebase.database().ref("/motionSensorData");

//background variables for logic
var long = 0;
var short = 0;
var threshold = 500;
var sensorStatus = "NNNN"; //initialises to 4 nonsense letters and update until we get LSLL
var numVisitor = 0;

//variables from html file
var longMsg = document.getElementById('longMsg');
var shortMsg = document.getElementById('shortMsg');
var visitor = document.getElementById('visitor');
var reset = document.getElementById('reset');

ref.on("child_added", function(snapshot){
  var value = snapshot.val();
  var time = value.time * 1000;
  if (time > threshold)
  {
    long++;
    longMsg.innerHTML = "Number of long messages: ";
    longMsg += long;
    sensorStatus = sensorStatus.splice(1, 4);
    sensorStatus += "L";
  }
  else {
    short++;
    shortMsg.innerHTML = "Number of short messages: ";
    shortMsg.innerHTML += short;
    sensorStatus = sensorStatus.splice(1, 4);
    sensorStatus += "S";
  }
  if (sensorStatus=="LSLL")
  {
    numVisitor++;
    visitor.innerHTML = "Number of visitors: ";
    visotr.innerHTML += numVisitor;
  }
});

reset.addEventListener('click', function(){
  socket.emit('reset');
  long = 0;
  short = 0;
  numVisitor = 0;
  visitor.innerHTML = "Number of visitors: ";
  visotr.innerHTML += numVisitor;
  longMsg.innerHTML = "Number of long messages: ";
  longMsg += long;
  shortMsg.innerHTML = "Number of short messages: ";
  shortMsg.innerHTML += short;
  sensorStatus = "NNNN";
});
