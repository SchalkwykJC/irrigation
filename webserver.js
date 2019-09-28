var http = require('http').createServer(handler);
var fs = require('fs');
var io = require('socket.io')(http);
var Gpio = require('onoff').Gpio;
var LED = new Gpio(4,'out');

var lightvalue = 0;

http.listen(8080);
LED.writeSync(1);

console.log("LED:" + LED.readSync() + " LightValue:" + lightvalue);


function handler(req, res){
	fs.readFile(__dirname + '/public/index.html', function(err, data){
		if (err){
			res.writeHead(404, {'Content-Type': 'text/html'});
			return res.end("404 Nothing to see here")
		}
		res.writeHead(200, {'Content-Type':'text/html'});
		res.write(data);
		return res.end();
	});
}

io.sockets.on('connection', function(socket) {
	

	socket.on('light', function(data) {
	
		console.log("Data:" + data);

		lightvalue = data;

		if (lightvalue != LED.readSync()){

			console.log("Hier");

			console.log("Webserver " + lightvalue);
			console.log("LED " + LED.readSync());
			LED.writeSync(lightvalue);
		}
		
	});
});

process.on('SIGINT', function() {
	LED.writeSync(0);
	LED.unexport();
	process.exit();
});
