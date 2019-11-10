var http = require('http').createServer(handler);
var fs = require('fs');
var io = require('socket.io')(http);
var Gpio = require('onoff').Gpio;
var LineOne = new Gpio(4,'out');

var lightvalue = 0;

http.listen(8080);
LineOne.writeSync(1);

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


		console.log("State" + data.state);
		console.log("Line" + data.line);

		lineOneValue = data.state;

		if (lineOneValue != LineOne.readSync()){

			LineOne.writeSync(lineOneValue);
		}
		
	});
});

process.on('SIGINT', function() {
	LineOne.writeSync(0);
	LineOne.unexport();
	process.exit();
});
