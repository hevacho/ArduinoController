//ver https://riptutorial.com/es/node-js/example/31580/comunicacion-del-nodo-js-con-arduino-a-traves-de-serialport-
//para montar servidor express

var SerialPort = require("serialport");


var arduinoCOMPort = "COM4";

var arduinoSerialPort = new SerialPort(arduinoCOMPort, {
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

arduinoSerialPort.on('open', function() {
    console.log('Serial Port ' + arduinoCOMPort + ' is opened.');
    var composite = "";
    arduinoSerialPort.on('data', function(data) {
        data = data.toString('utf-8');
        composite = composite + data;
        if (composite.includes('END')) {
            composite = composite.replace('END', '');
            console.log(composite);
            composite = "";
        }
    });
});




sleep(2000).then(() => {
    console.log('Encendiendo dos');
    var obj = { command: "on", relayNumber: 1 };
    arduinoSerialPort.write(JSON.stringify(obj));

    var obj = { command: "on", relayNumber: 2 };
    arduinoSerialPort.write(JSON.stringify(obj));
})

sleep(3000).then(() => {
    console.log('LeyendoDatos');
    var obj = { command: "getData", relayNumber: 2 };
    arduinoSerialPort.write(JSON.stringify(obj));
})

sleep(10000).then(() => {
    console.log('Apagando rojo');
    var obj = { command: "off", relayNumber: 1 };
    arduinoSerialPort.write(JSON.stringify(obj));
})

sleep(12000).then(() => {
    console.log('LeyendoDatos');
    var obj = { command: "getData", relayNumber: 2 };
    arduinoSerialPort.write(JSON.stringify(obj));
})

sleep(20000).then(() => {
    console.log('Apagando amarillo');
    var obj = { command: "off", relayNumber: 2 };
    arduinoSerialPort.write(JSON.stringify(obj));
})

sleep(30000).then(() => {
    console.log('Encendiendo rojo');
    var obj = { command: "on", relayNumber: 1 };
    arduinoSerialPort.write(JSON.stringify(obj));
})

sleep(35000).then(() => {
    console.log('Encendiendo amarillo');
    var obj = { command: "on", relayNumber: 2 };
    arduinoSerialPort.write(JSON.stringify(obj));
})