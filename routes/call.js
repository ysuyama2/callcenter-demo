var express = require('express');
var router = express.Router();
var twilio = require('twilio');
var util = require('util');

var callerId = process.env.TWILIO_PHONE_NUMBER;

/* 接続 */
router.post('/connect',twilio.webhook({validate: false}), function(req, res, next) {
	var twiml = new twilio.TwimlResponse();
	//console.log('req.body:'+util.inspect(req.body));
	phoneNumber = req.body.phoneNumber;

	var numberDialer = function(dial) {
    	dial.number(convertTWLPhoneFormat(phoneNumber));
  	};

  	var clientDialer = function(dial) {
     	dial.client("support_agent");
  	};

 	if (phoneNumber != null) {
    	twiml.dial({callerId : callerId}, numberDialer);
  	}else {
    	twiml.dial({callerId : callerId}, clientDialer);
  	}  	

  	res.send(twiml.toString());

});

/** IVRに誘導 **/
router.post('/recieve',twilio.webhook({validate: false}), function(req, res, next) {
	var twiml = new twilio.TwimlResponse();
	//console.log('req.body:'+util.inspect(req.body));
	//console.log('req:'+util.inspect(req));

  	var clientDialer = function(dial) {
     	dial.client("support_agent");
  	};
    var opt = {
        voice: 'woman',
        language: 'ja-jp'
    };

    twiml.say('こちらは、テラスコです。', opt)
    	 .gather({
    	 	action: 'https://callcenter-demo.herokuapp.com/call/recieve/select_menu',
    	 	method: 'GET',
    	 	timeout:20
    	 },function () {
    	 	this.say('請求に関するお問い合わせは1番を',opt)
    	 		.say('オペレータと通話を希望されるかたは2番を',opt)
    	 		.say('その他のお問い合わせは3番を',opt)
    	 		.say('入力後シャープを押してください',opt)
    	 });

  	res.send(twiml.toString());

});

/**IVR 選択判定結果処理**/
router.get('/recieve/select_menu',function(req, res, next) {
	var pushNumber = req.query.Digits;
	//console.log("pushNumber=" + pushNumber);
	//console.log("req.query=" + util.inspect(req.query));
	//console.log("req.query" + util.inspect(req.query.From));
	var twiml = new twilio.TwimlResponse();

    var opt = {
        voice: 'woman',
        language: 'ja-jp'
    };

  	var clientDialer = function(dial) {
     	dial.client("support_agent");
  	};
  	if(pushNumber === "1"){
  		twiml.say('おてすうですが、請求書に関しては03,00,00,00,00へお掛け直しください', opt);
  	}
  	if(pushNumber === "2"){
  		twiml.dial({
          callerId : convertJpPhoneFormat(req.query.From),
          record: true
        }, clientDialer);
  	}
  	if(pushNumber === "3"){
  		twiml.say('その他のお問合せに関しては現在使われておりません。もう一度お掛け直しください。', opt);
  	}

  	res.send(twiml.toString());

});


var convertTWLPhoneFormat = function (phoneNumber) {
	var regExp = new RegExp(/^\+81/g) ;
	if(regExp.test(phoneNumber)) return phoneNumber;

	return phoneNumber.replace(/^0/,"+81");

};

var convertJpPhoneFormat = function (phoneNumber) {
  var regExp = new RegExp(/^\+81/g) ;
  if(!regExp.test(phoneNumber)) return phoneNumber;

  return phoneNumber.replace(/^\+81/,"0");

};

module.exports = router;