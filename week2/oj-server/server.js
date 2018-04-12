const express = require('express'); // import express package
const app = express(); // create http application
const path = require('path');
const restRouter = require('./routes/rest');
const mongoose = require('mongoose');



app.use('/api/v1', restRouter);

app.use(express.static(path.join(__dirname, '../public')));


app.use((req,res)=>{
	res.sendFile('index.html',{root:path.join(__dirname,'../public')});
})


mongoose.connect('mongodb://youngdriver:wanttobeold@ds143340.mlab.com:43340/olddriver');


app.listen(3000, () => console.log('Example app listening on port3000!'));
