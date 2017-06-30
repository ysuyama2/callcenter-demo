var express = require('express');
var router = express.Router();
var port = normalizePort(process.env.PORT || '3000');
var util = require('util');

router.get('/', function(req, res, next) {
  res.render('phone');
});

router.post('/', function(req, res, next) {
  res.render('phone');
});

module.exports = router;

function normalizePort(val) {
var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}
