var request = require('request');
var baseurl = require('../../config').platform.baseurl;

/*플랫폼 로그인 인증 API*/
module.exports = {
  login : function(d, callback = function(a){}){
    var headersOpt = {
      "content-type": "application/json"
    };
    var opt = {
      method : 'post',
      url : baseurl+'/auth/login',
      headers : headersOpt,
      json : true,
      form : JSON.stringify(d),
      strictSSL : false,
      secureProtocol : 'TLSv1_method'
    };

    request(opt, function (err, res, body){
      if(err) callback(false);
      else callback(true, body);
    });
  }
};
