var socket = io.connect('http://localhost:8080', {reconnect: true});
var ref = firebase.database().ref().child('motionSensorData');

var ledToggle = document.getElementbyId('ledToggle');
var sensorToggle = document.getElementbyId('sensorToggle');
var reset = document.getElementbyId('reset');
var serverMessage = document.getElementbyId('serverMessage');

var count = 0;

serverMessage.innerHTML = "connected";

function ToggleLed()
{
  socket.emit('ledchange');
}

function SensorToggle()
{
  socket.emit('sensorchange');
}

function ResetDatabase()
{
  socket.emit('reset');
}
