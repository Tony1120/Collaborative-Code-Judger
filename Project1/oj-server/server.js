const express = require('express'); // import express package
const app = express(); // create http application
const path = require('path');
const http = require('http');
const restRouter = require('./routes/rest');
const mongoose = require('mongoose');
// response for GET request when url matches '/'
// send 'Hello World!' to client nomatter what the request is
//app.get('/', (req, res) => res.send('Hello World!!!!'));
// launch application, listen on port 3000
var socketIO = require('socket.io');
var io = socketIO();
var editorSocketService = require('./services/editorSocketService')(io);



mongoose.connect('mongodb://driver:driver123@ds141514.mlab.com:41514/problems'),{ useNewUrlParser: true };


app.use('/api/v1', restRouter);
app.use(express.static(path.join(__dirname, '../public/'))); 
// app.listen(3000, () => console.log('Example app listening on port3000!'));
app.use((req, res) =>{
	res.sendFile('index.html', {root: path.join(__dirname, '../public/')});
})

const server = http.createServer(app);
io.attach(server);
server.listen(3000);
server.on('listening', onListening);

function onListening() {
	// body...
	console.log('App listening on port 3000!');
}