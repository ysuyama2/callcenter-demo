var express = require('express');
var router = express.Router();
var twilio = require('twilio');
var util = require('util');

var appSid = process.env.TERRA_CALL_CENTER_SID;
var accountSid = process.env.TWILIO_ACCOUNT_SID;
var authToken = process.env.TWILIO_AUTH_TOKEN;
var twillioPhoneNum = process.env.TWILIO_PHONE_NUMBER;

var capability = new twilio.Capability(accountSid, authToken);
capability.allowClientOutgoing(appSid);
capability.allowClientIncoming("support_agent");
var token = capability.generate(600);

router.post('/', function(req, res, next) {
	//console.log('token:'+util.inspect(token));
	res.writeHead(200, {'content-type': 'text/json' });
	res.end(JSON.stringify({ token : token}) );

});

module.exports = router;