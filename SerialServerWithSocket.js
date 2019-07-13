//ver https://riptutorial.com/es/node-js/example/31580/comunicacion-del-nodo-js-con-arduino-a-traves-de-serialport-
//para montar servidor express

var SerialPort = require("serialport");
const express = require('express');
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8081 });

const app = express();
const arduinoCOMPort = "COM4";
const port = 3000;
const arduinoSerialPort = new SerialPort(arduinoCOMPort, {
    baudRate: 9600
});
const parsers = SerialPort.parsers

// Use a `\r\n` as a line terminator
const parser = new parsers.Readline({
    delimiter: '\n',
})

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {});

    sendRelayStatus();

});


arduinoSerialPort.on('open', function() {
    console.log('Serial Port ' + arduinoCOMPort + ' is opened.');
    var composite = "";
    arduinoSerialPort.on('data', function(data) {
        data = data.toString('utf-8');
        composite = composite + data;
        if (composite.includes('END')) {
            composite = composite.replace('END', '');
            console.log(composite);
            broadcastData(composite);
            composite = "";
        }
    });
});

function broadcastData(composite) {
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(composite);
        }
    });
}

function sendRelayStatus() {
    var obj = { command: "getData" };
    console.log(`Reading Data.....`);
    message = JSON.stringify(obj);
    arduinoSerialPort.write(message);
}

app.listen(port, function() {
    console.log('Example app listening on port http://localhost:' + port + '!');
});

app.get('/', function(req, res) {
    return res.send('Service ON');
})

app.get('/:action', function(req, res) {

    var action = req.params.action;
    var number = req.query.number;

    var message;

    if (action == 'on') {
        var obj = { command: "on" };
        obj.relayNumber = number;
        message = JSON.stringify(obj);
        console.log(`Switch on of relay ${number}`);

    }
    if (action == 'off') {
        var obj = { command: "off" };
        obj.relayNumber = number;
        message = JSON.stringify(obj);
        console.log(`Switch off of relay ${number}`);
    }

    if (action == 'getData') {
        console.log('LeyendoDatos');
        var obj = { command: "getData" };
        console.log(`Reading Data.....`);
        message = JSON.stringify(obj);
    }

    if (message) {
        arduinoSerialPort.write(message);
    }


    return res.send('Action: ' + action);

});