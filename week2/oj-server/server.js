const express = require('express'); // import express package
const app = express(); // create http application
const restRouter = require('./routes/rest');

app.use('/api/v1', restRouter);

app.listen(3000, () => console.log('Example app listening on port3000!'));
