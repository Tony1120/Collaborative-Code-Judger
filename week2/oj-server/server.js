const express = require('express'); // import express package
const app = express(); // create http application
const path = require('path');
const restRouter = require('./routes/rest');
const mongoose = require('mongoose');

const http = require('http');

var socketIO = require('socket.io');
var io = socketIO();
var editorSocketService = require('./services/editorSocketService')(io);




app.use('/api/v1', restRouter);

app.use(express.static(path.join(__dirname, '../public')));


app.use((req,res)=>{
	res.sendFile('index.html',{root:path.join(__dirname,'../public')});
})


mongoose.connect('mongodb://youngdriver:wanttobeold@ds143340.mlab.com:43340/olddriver');


//app.listen(3000, () => console.log('Example app listening on port3000!'));
const server = http.createServer(app);
io.attach(server);
server.listen(3000);
server.on('listening',onListening);

function onListening(){
	console.log('Example app listening on port3000!')
}