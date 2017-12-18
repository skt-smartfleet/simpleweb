var Apps = require('../models/smartfleet/apps');
var proj4 = require('proj4');

/*RPC 전송 컨트롤러*/
exports.rpc = function(req, res, next){
  Apps.api.sendRPC(req.body.sensorId, req.body.data, function(result, data){
    if(result && typeof data.status == 'undefined'){
      res.json(data);
    }
    else res.status(500).send({ error: 'sendRPC failed!' , detail : data});
  });
};

/*유저 회사, 차량, 센서 정보 세팅 컨트롤러*/
exports.set = function(req, res, next){
  var userInfo = {};
  var sData = [];
  if(typeof req.query.token != 'undefined'){
    Apps.userInfo.storeToken(req.query.token);

    Apps.api.getCompany(function(result, data){
      if(result && typeof data.errorCode == 'undefined'){
        Apps.userInfo.storeCompanyId(data.id.id);
        userDataUpdate(function(result, data){
          if(result) res.json(data);
          else res.status(500).send(data);
        });
      } else {
        res.status(500).send({ error: 'getCompany failed!' , detail : data});
      }
    });
  } else {
    userDataUpdate(function(result, data){
      if(result) res.json(data);
      else res.status(500).send(data);
    });
  }
};

function userDataUpdate(callback){
  var userData = [];
  var asyncGetVehicles = function(param){
    return new Promise(function(resolve, reject){
      Apps.api.getVehicles(function(result, data){
        if(result && typeof data.errorCode == 'undefined' && data.data.length != 0){
          var idx = 0;
          for(; idx< data.data.length; idx++ ){
            param.push({
              vid : data.data[idx].id.id,
              vname : data.data[idx].vehicleNo,
              sid : '',
              trips : []
            });
          }
          if(idx==data.data.length) resolve(param);
        } else {
          res.status(500).send({ error: 'getVehicles failed!' , detail : data});
          reject();
        }
      });
    });
  };
  var asyncGetSensors = function(param){
    return new Promise(function(resolve, reject){
      Apps.api.getSensors(function(result, data){
        if(result && typeof data.errorCode == 'undefined' && data.data.length != 0){
          var idx=0;
          for(;idx<param.length;idx++){
            for(var i=0; i< data.data.length; i++){
              if(data.data[i].vehicleId.id == param[idx].vid)
                param[idx].sid = data.data[i].id.id;
            }
          }
          if(idx==param.length){
            resolve(param);
          }
        }
        else {
          res.status(500).send({ error: 'getSensors failed!' , detail : data});
          reject();
        }
      });
    });
  };
  var promiseGetTrips = function(param){
    return new Promise(function(resolve, reject){
      Apps.api.getTrip(param.vid, function(result, data){
        if(result && typeof data.errorCode == 'undefined'){
          param.trips = data.data;
          resolve();
        } else {
          res.status(500).send({ error: 'getTrips failed!' , detail : data});
          reject();
        }
      });
    });
  };

  asyncGetVehicles(userData)
    .then(asyncGetSensors)
    .then(result => {
      var actions = result.map(promiseGetTrips);
      Promise.all(actions).then(function(values){
        callback(true, userData);
      });
    })
    .catch(function(e) {console.log(e);});
}

exports.update = function(req, res, next){
  Apps.api.getDriver(req.query.driverId, function(result, d_data){
    var dname =  '';
    if(result && typeof d_data.errorCode == 'undefined'){
      var dname = d_data.name;
    } else {
      dname = 'undefined';
    }
    Apps.api.getMicrotrip(req.query.tripId, function(result, data){
      if(result && typeof data.errorCode == 'undefined'){
        var promiseGetMicrotrips = function(dt){
          return new Promise(function(resolve, reject){
            if( ! Array.isArray(dt.payload) ) dt.payload = [dt.payload];
            dt.payload.forEach((micro, index) => {
              var coord = proj4('GOOGLE', [micro.lon, micro.lat]);
              micro.lon = coord[0];
              micro.lat = coord[1];
              micro.event = getEvent(micro.em);
              Apps.api.geocoding(coord[1], coord[0], function(result,addrDt){
                if(result) micro.addressInfo = addrDt.addressInfo.fullAddress;
                else micro.addressInfo = 'No Address'
                if(index == dt.payload.length - 1) resolve();
              });
            });
          });
        };

        var actions = data.data.map(promiseGetMicrotrips);
        Promise.all(actions).then(function(values){
          res.json({dname : dname, micro : data});
        });
      } else {
        res.status(500).send({ error: 'getMicroTrip failed!' , detail : data});
      }
    });
  });
};

/*이벤트 코드를 string으로 변환*/
function getEvent(hex){
  let str = parseInt(hex, 16).toString(2).toString();
  let e_arr = [];
  while (str.length < 8) {
    str = '0' + str;
  }
  if (str[7] == 1) {
    e_arr.push('급출발');
  }
  if (str[6] == 1) {
    e_arr.push('급좌회전');
  }
  if (str[5] == 1) {
    e_arr.push('급우회전');
  }
  if (str[4] == 1) {
    e_arr.push('급유턴');
  }
  if (str[3] == 1) {
    e_arr.push('급감속');
  }
  if (str[2] == 1) {
    e_arr.push('급가속');
  }
  if (str[1] == 1) {
    e_arr.push('급정지');
  }
  if (str == 99) {
    e_arr.push('접촉사고');
  }
  return e_arr;
}
