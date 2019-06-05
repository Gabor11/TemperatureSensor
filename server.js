"use strict";
var http = require('http');
var port = process.env.PORT || 1337;
var five = require("johnny-five");
var board = new five.Board();
var thermistorPin = 0;
var R1 = 10000;
var Vo; var logR2; var R2; var T;
var c1 = 1.009249522e-03;
var c2 = 2.378405444e-04;
var c3 = 2.019202697e-07;

board.on("ready", function () {
    var sensor = new five.Sensor({
        pin: thermistorPin,
        freq: 500
    });

    sensor.on("data", function () {
        Vo = this.scaleTo(0, 1023);
        R2 = R1 * (1023.0 / Vo - 1.0);
        logR2 = Math.log(R2);
        T = (1.0 / (c1 + c2 * logR2 + c3 * logR2 * logR2 * logR2));
        T = T - 273.15;
        T = Math.round(T * 100) / 100;
    });

    this.repl.inject({
        tempSensor: sensor
    });
});

http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Temperature: ' + T + ' C\n');
}).listen(port);
