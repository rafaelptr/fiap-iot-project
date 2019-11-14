var express = require('express');
var app = express();
var basicAuth = require('basic-auth');
var five = require('johnny-five');
//var board = new five.Board();
var board = new five.Board({ port: "COM5" });
const port = 3000;

var led;

board.on("ready", function () {
    led = new five.Led(10);
    console.log("five ready led="+led);
});

var auth = function (req, res, next) {
    function unauthorized(res) {
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        return res.sendStatus(401);
    };
    var user = basicAuth(req);
    if (!user || !user.name || !user.pass) {
        return unauthorized(res);
    };
    if (user.name === 'rafapet' && user.pass === 'iot') {
        return next();
    } else {
        return unauthorized(res);
    };
};
//ROTA SEM AUTENTICACAO
app.get('/', function (req, res) {
    res.send('Benvindo ao mundo das APIs');
});
//ROTA COM AUTENTICACAO
app.put('/led/ligar', auth, function (req, res) {
    led.on();
    res.sendStatus(200);
});
app.put('/led/desligar', auth, function (req, res) {
    led.off();
    res.sendStatus(200);
});

app.listen(port, function () {
    console.log("Listening on port " + port)
});