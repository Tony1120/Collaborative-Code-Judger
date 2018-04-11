const express = require('express'); // import express package
const app = express(); // create http application
const restRouter = require('./routes/rest');
const mongoose = require('mongoose');



app.use('/api/v1', restRouter);



mongoose.connect('mongodb://jliang:123456@ds143340.mlab.com:43340/olddriver');


app.listen(3000, () => console.log('Example app listening on port3000!'));
