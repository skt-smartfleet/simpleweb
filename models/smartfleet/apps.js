var request = require('request');
var baseurl = require('../../config').platform.baseurl;
var config = require('../../config');

var userInfo = {
  token : null,
  companyId : null,
  storeToken : function(token){
    userInfo.token = token;
  },
  storeCompanyId : function(companyId){
    userInfo.companyId = companyId;
  }
};

exports.userInfo = userInfo;

exports.api = {
  /*계정 회사 정보 API*/
  getCompany : function(callback = function(a){}){
    var headersOpt = {
      "content-type": "application/json",
      "X-Authorization": "Bearer "+userInfo.token
    };

    var opt = {
      method : 'get',
      url : baseurl+'/tre/v1/company/me',
      headers : headersOpt,
      json : true,
      strictSSL : false,
      secureProtocol : 'TLSv1_method'
    };

    request(opt, function (err, res, body){
      if(err) callback(false);
      else callback(true, body);
    });
  },

  /*유저 차량 정보 API*/
  getVehicles : function(callback = function(a){}){
    var headersOpt = {
      "content-type": "application/json",
      "X-Authorization": "Bearer "+userInfo.token
    };

    var opt = {
      method : 'get',
      url : baseurl+'/tre/v1/company/'+userInfo.companyId+'/vehicles',
      qs : {limit:10},
      headers : headersOpt,
      json : true,
      strictSSL : false,
      secureProtocol : 'TLSv1_method'
    };

    request(opt, function (err, res, body){
      if(err) callback(false);
      else callback(true, body);
    });
  },

  /*유저 센서 정보 API*/
  getSensors : function(callback = function(a){}){
    var headersOpt = {
      "content-type": "application/json",
      "X-Authorization": "Bearer "+userInfo.token
    };

    var opt = {
      method : 'get',
      url : baseurl+'/tre/v1/sensors',
      qs : {limit:10, companyId: userInfo.companyId},
      headers : headersOpt,
      json : true,
      strictSSL : false,
      secureProtocol : 'TLSv1_method'
    };

    request(opt, function (err, res, body){
      if(err) callback(false);
      else callback(true, body);
    });
  },

  getDriver : function(driverId, callback = function(a){}){
    var headersOpt = {
      "content-type": "application/json",
      "X-Authorization": "Bearer "+userInfo.token
    };
    var opt = {
      method : 'get',
      url : baseurl+'/tre/v1/driver/'+driverId,
      headers : headersOpt,
      json : true,
      strictSSL : false,
      secureProtocol : 'TLSv1_method'
    };

    request(opt, function (err, res, body){
      if(err) callback(false);
      else callback(true, body);
    });
  },

  /*Get Latest Trip API*/
  getLastTrip : function(vehicleId, callback = function(a){}){
    var headersOpt = {
      "content-type": "application/json",
      "X-Authorization": "Bearer "+userInfo.token
    };

    var opt = {
      method : 'get',
      url : baseurl+'/tre/v1/vehicle/'+vehicleId+'/trip/latest',
      headers : headersOpt,
      json : true,
      strictSSL : false,
      secureProtocol : 'TLSv1_method'
    };

    request(opt, function (err, res, body){
      if(err) callback(false);
      else callback(true, body);
    });
  },

  /*Get Latest microtrip API*/
  getLastMicroTrip : function(vehicleId, callback = function(a){}){
    var headersOpt = {
      "content-type": "application/json",
      "X-Authorization": "Bearer "+userInfo.token
    };

    var opt = {
      method : 'get',
      url : baseurl+'/tre/v1/vehicle/'+vehicleId+'/microtrip/latest',
      headers : headersOpt,
      json : true,
      strictSSL : false,
      secureProtocol : 'TLSv1_method'
    };

    request(opt, function (err, res, body){
      if(err) callback(false);
      else callback(true, body);
    });
  },

  /*Get microtrip list API*/
  getMicrotrip : function(tripId, callback = function(a){}){
    var headersOpt = {
      "content-type": "application/json",
      "X-Authorization": "Bearer "+userInfo.token
    };

    var opt = {
      method : 'get',
      url : baseurl+'/tre/v1/trip/'+tripId+'/microtrips',
      headers : headersOpt,
      json : true,
      strictSSL : false,
      secureProtocol : 'TLSv1_method',
      qs : {limit : 20}
    };

    request(opt, function (err, res, body){
      if(err) callback(false);
      else callback(true, body);
    });
  },

  getTrip : function(vehicleId, callback = function(a){}){
    var headersOpt = {
      "content-type": "application/json",
      "X-Authorization": "Bearer "+userInfo.token
    };

    var opt = {
      method : 'get',
      url : baseurl+'/tre/v1/vehicle/'+vehicleId+'/trips',
      headers : headersOpt,
      json : true,
      qs : { limit : 10},
      strictSSL : false,
      secureProtocol : 'TLSv1_method'
    };

    request(opt, function (err, res, body){
      if(err) callback(false);
      else callback(true, body);
    });
  },

  /*Send RPC Request API*/
  sendRPC : function(sensorId, data, callback=function(a){}){
    var headersOpt = {
      "content-type": "application/json",
      "X-Authorization": "Bearer "+userInfo.token
    };

    var opt = {
      method : 'post',
      url : baseurl+'/plugins/rpc/twoway/'+sensorId,
      headers : headersOpt,
      json : data,
      strictSSL : false,
      secureProtocol : 'TLSv1_method'
    };

    request(opt, function (err, res, body){
      if(err) callback(false);
      else callback(true, body);
    });
  },

  /*현재 위치 행정동 출력 API*/
  geocoding : function(lat, lon, callback = function(a){}){
    var headersOpt = {
      "content-type": "application/json",
      "appKey": config.appkey
    };
    request({
      method : 'get',
      url : "https://apis.skplanetx.com/tmap/geo/reversegeocoding",
      headers : headersOpt,
      qs : {version: 1, lat:lat, lon:lon, addressType:"A01"},
      json : true
    }, function (err, res, body){
      if(err || body == null || typeof(body.addressInfo) == 'undefined') callback(false);
      else callback(true, body);
    });
  }

};
