var vehicleInfo = [];
var ex_trip = '';

$(document).ready(function(){
  let token = sessionStorage.getItem('token');
  if(token == null){
    location.href = '/login';
  }

  makeSpeedometer(0,200,'gaugeSpeed','km/h');
  makeSpeedometer(0,100,'gaugeEngine','%');

  mapView = new Tmap.Map({div:"map_div", width:'100%', height:'100%'});
  mapView.addControl(new Tmap.Control.MousePosition());
  $('#Tmap_Map_7_Tmap_Container').css({
    'z-index' : 0
  });
  $('#Tmap_Control_MousePosition_67, #Tmap_Control_Attribution_6').css({
    'z-index' : 100
  });

  $('.btn_reload').addClass('spin');

  setUserInfo({token:token});
});

function setUserInfo(data = {}){
  $.ajax({
    type: "GET",
    url: "/app/set",
    contentType: 'application/json',
    data: data,
    success: function(d){
      let vnames = [];
      for(var i=0; i< d.length; i++){
        vnames.push(d[i].vname);
        sessionStorage.setItem(d[i].vname, JSON.stringify(d[i]));
      }
      sessionStorage.setItem('vehicles', JSON.stringify(vnames));
      setSearchBar();
    },
    error : function(err){
      let str = err.responseJSON.error;
      if(typeof err.responseJSON.detail == 'object') str += '\n[CAUSE] '+err.responseJSON.detail.message;
      alert(str);
    }
  });
}

function setSearchBar(setTrip = false){
  if(setTrip && vehiclesList.value != ''){
    //Trip Selector 동적 d생성
    let v_dt = JSON.parse( sessionStorage.getItem(vehiclesList.value) );
    $('#tripList option').not('option:first').remove();
    for(var i=0; i< v_dt.trips.length; i++){
      $('#tripList').append(
        '<option value="'+v_dt.trips[i].id.id+'">'
        +v_dt.trips[i].startDt+' ~ '+ v_dt.trips[i].endDt
        +'</option>'
      );
    }
  } else {
    //Vehicle Selector 동적 생성
    let v_arr = JSON.parse( sessionStorage.getItem('vehicles') );
    $('#vehiclesList option').not(':first').remove();
    $('#tripList option').not('option:first').remove();
    for(var i=0; i< v_arr.length; i++){
      $('#vehiclesList').append(
        '<option value="'+v_arr[i]+'">'
        +v_arr[i]
        +'</option>'
      );
    }
  }
  $('.btn_reload').removeClass('spin');
}

/*Get Microtrip data*/
function getMicrotrip(){
  if ( $('.btn_reload').hasClass('spin') ) return;
  if(tripList.value == '') return;
  let v_name = vehiclesList.value;
  let tid = tripList.value;
  let v_dt = JSON.parse( sessionStorage.getItem(v_name) );
  let dname = '';
  let t_cnt = 0;
  for(; t_cnt<v_dt.trips.length; t_cnt++){
    if(v_dt.trips[t_cnt].id.id == tid) break;
  }

  if(Array.isArray(v_dt.trips[t_cnt].userId)) dname = v_dt.trips[t_cnt].userId[0].id;
  else dname = v_dt.trips[t_cnt].userId.id;

  $.ajax({
    type: "GET",
    url: "/app/update",
    contentType: 'application/json',
    data: {driverId: dname,tripId:tid},
    success: function(d){
      $('#driverName').val(d.dname);
      while (mapView.layers.length > 1) {
        mapView.removeLayer(mapView.layers[mapView.layers.length - 1]);
      }

      $('.traffic-list').empty();
      $('#consoleArea').empty();

      let pld = v_dt.trips[t_cnt].payload;

      chgSpeed("gaugeSpeed", 0);
      chgSpeed("gaugeEngine", 0);
      chgVoltage("battery-gauge", 0);
      chgTemp("therm-gauge", 0);
      if(t_cnt != v_dt.trips.length && pld != null && typeof pld.ctp != 'undefined' ){
        chgTemp("therm-gauge", pld.ctp);
      }

      fnConsole(v_dt.trips[t_cnt]);
      fnConsole(d.micro);
      asyncloop(0, d.micro.data, false, function(idx, dt, callback){
        fnMapDrawing(idx, d.micro.data.length -1 , dt, mapView);
        fnEventLoging(dt.ts, v_name, dt.payload);
        dt.payload.forEach((micro, index) => {
          if(typeof micro.el != 'undefined') chgSpeed("gaugeEngine", micro.el);
          if(typeof micro.vv != 'undefined') chgVoltage("battery-gauge", micro.vv);
          if(typeof micro.sp != 'undefined') chgSpeed("gaugeSpeed", micro.sp);
        });
        callback();
      }, function(){
      });
    },
    error : function(err){
      let str = '';
      if( err.responseJSON != null && err.responseJSON.hasOwnProperty('error')){
        str += err.responseJSON.error ;
        if(err.responseJSON.hasOwnProperty('detail')) str += '\n[CAUSE] '+err.responseJSON.detail.message;
        alert(str);
      }
      else console.error(err);
    }
  });
}

function asyncloop(idx, arr, ascOrder = true, fnEach, fnEnd){
  var cItem = arr[(ascOrder?idx:arr.length-1-idx)];
  fnEach(idx, cItem, function(){
    idx ++;
    if(idx == arr.length) fnEnd();
    else asyncloop(idx, arr, ascOrder, fnEach, fnEnd);
  });
}

/*로그아웃 처리*/
function logout(){
  sessionStorage.clear();
  location.href = '/login';
}

function fnRefresh(){
  if ( $('.btn_reload').hasClass('spin') ) return;
  $('.btn_reload').addClass('spin');
  let v_arr = JSON.parse( sessionStorage.getItem('vehicles') );
  if(v_arr == null) return ;

  $('#driverName').val('');
  while (mapView.layers.length > 1) {
    mapView.removeLayer(mapView.layers[mapView.layers.length - 1]);
  }
  $('.traffic-list').empty();
  $('#consoleArea').empty();
  chgSpeed("gaugeSpeed", 0);
  chgSpeed("gaugeEngine", 0);
  chgVoltage("battery-gauge", 0);
  chgTemp("therm-gauge", 0);
  sessionStorage.removeItem('vehicles');
  for(var i=0; i< v_arr.length; i++){
    sessionStorage.removeItem(v_arr[i]);
  }

  setUserInfo();
}
