	const http = require('http');
	const fs = require('fs')
	var contents = fs.readFileSync("config.json");
	var jsonContent = JSON.parse(contents);
	var SerialPort = require('serialport');
	var arduino = new SerialPort(jsonContent.ComPort, { autoOpen: true });
	var port = jsonContent.port;
	var io = require('socket.io');
	var dir1;
	var dir2;
	var pcorphone;

	const server = http.createServer((req, res) => {
		console.log(req);
		var ConnectedIp = req.connection.remoteAddress;
		if(req.url == '/')
		{
			fs.createReadStream('index.html').pipe(res);
		}
		if(req.url == '/pc')
		{
			fs.createReadStream('index_pc.html').pipe(res);
			pcorphone = false;
		}
		if(req.url == '/phone')
		{
			fs.createReadStream('index_phone.html').pipe(res);
			pcorphone = true;
		}


	});
	server.listen(port, (err) => {  
		console.log('Mert4x4 Led Server');
		console.log('Server is running...');
	})
	var socket = io.listen(server);

	socket.on('connection', function(client){ 
		client.on('message',function(event){ 
			console.log(event);
			var dir = event;
			if(pcorphone == true)
			{
				dir1 = dir;
				if(dir1 != dir2)
				{
					arduino.write(dir + "\n");
				}
				dir2 = dir;
			}
			else if(pcorphone == false)
			{
				arduino.write(dir + "\n");
			}	

		});
	});