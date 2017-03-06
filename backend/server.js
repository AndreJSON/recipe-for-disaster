'use strict';
var port = 8080;
var express = require('express');
var app = express();
var chalk = require('chalk');

var bodyParser = require('body-parser');
app.use(bodyParser.json());

require('./paths.js')(app);

var router = require('./routes.js');
app.use('/api', router);

app.listen(port);
console.log(chalk.green("Server is now listening on port: ") + chalk.magenta(port));