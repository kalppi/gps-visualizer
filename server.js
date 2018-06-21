const express = require('express');
const path = require('path');

const app = express();
const port = 3050;

app.use(express.static(path.join(__dirname, 'builds')));

app.listen(port);
console.log('Listening on :' + port);
