const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const GPS = require('gps');

// const file = '/dev/cu.usbserial';
// const file = '/dev/ttyUSB0';
// const file = '/dev/tty.usbserial';
// const file = '/dev/tty.usbmodem1411';
const file = 'COM3';

const gps = new GPS();

const SerialPort = require('serialport');
const port = new SerialPort(file, {
  baudRate: 4800
});

const parsers = SerialPort.parsers;
const parser = new parsers.Readline({
  delimiter: '\r\n'
});

port.pipe(parser);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/dashboard.html');
});

http.listen(3000, () => {
  console.log('listening on *:3000');

  gps.on('data', () => {
    io.emit('state', gps.state);
  });

  parser.on('data', data => {
    gps.update(data);
  });
});

