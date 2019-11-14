var express = require('express');
var app = express();
var basicAuth = require('basic-auth');
var five = require('johnny-five');
//var board = new five.Board();
var board = new five.Board({ port: "COM5" });
const port = 3000;

var isFilled = false;
var led;
var proximity;

app.get('/vaga/status', function (req, res) {
    res.send(isFilled ? "Vaga ocupada" : "Vaga livre");
});

app.listen(port, function () {
    console.log("Listening on port " + port)
});

board.on("ready", function () {
    led = new five.Led(10);
    console.log("five ready led="+led);

    proximity = new five.Proximity({
        controller: "HCSR04",
        pin: 7
    });    

    console.log("proximity="+proximity);
    
    proximity.on("change", () => {
        const {centimeters, inches} = proximity;
        /*console.log("Proximity: ");
        console.log("  cm  : ", centimeters);
        console.log("  in  : ", inches);
        console.log("-----------------");*/
        if(centimeters <= 10){
            isFilled = true;
            led.off();
        }
        else{
            isFilled = false;
            led.on();
        }
    });
});