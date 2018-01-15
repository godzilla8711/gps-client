const GPS = require('gps');

const file = 'COM3';

console.log('Starting GPS Client...');

// Create a serial port reference with a registered parser.
const SerialPort = require('serialport');
const port = new SerialPort(file, {baudRate: 4800});

const parsers = SerialPort.parsers;
const parser = new parsers.Readline({delimiter: '\r\n'});

port.pipe(parser);

let gps = new GPS();

// Register the GPS data listener to log the data whenever data is received on a periodic basis.
const LOG_EVERY_N_TIMES = 10;
const gpsDataType = 'GGA'; // GGA, GSA, RMC, GSV
let logCount = 0
gps.on(gpsDataType, data => {
  if (logCount % LOG_EVERY_N_TIMES === 0) {
    console.log(data);
  } else {
	  console.log('Skipping...');
	}
	++logCount;
});

// Register the GPS DMEA sentence parser to any data received from the serial port.
parser.on('data', data => {
  gps.update(data);
});

