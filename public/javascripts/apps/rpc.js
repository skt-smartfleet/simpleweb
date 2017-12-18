function fnRPCSend(){
  let v_dt = JSON.parse( sessionStorage.getItem(vehiclesList.value) );
  let sid = v_dt.sid;
  let msg = $('#dialogRequest textarea').val();
  let jsonResult = {};

  if(sid == '') return alert('센서 정보를 찾을 수 없습니다');
  try {
    jsonResult = JSON.parse(msg);
  }
  catch (e) {
    return alert('파라미터는 JSON형태여야 합니다');
  };

  let data = {
    sensorId : sid,
    data : jsonResult
  };

  fnConsole("Send RPC Request","#63004F");
  fnConsole(data,"#870073");

  $.ajax({
    type: "POST",
    url: "/app/rpc",
    contentType: 'application/json',
    data: JSON.stringify(data),
    success: function(d){
      let flag = true;
      let str = "";
      if(d.response.results = 2000) flag = false;
      if(!flag) str = data.data.method + " 요청 성공";
        else str = data.data.method + " 요청 실패";
      fnConsole("Get RPC Response","#63004F");
      fnConsole(d,"#63004F");
      csApp.makeToast(str, flag);
    },
    error : function(err){
      fnConsole("RPC Failed");
      if(typeof err.responseJSON.detail != 'undefined'){
        csApp.makeToast(data.data.method +" 요청 실패 ("+err.responseJSON.detail.message+")", true);
        fnConsole(err.responseJSON.detail);
      } else{
        console.error(err);
        fnConsole(err);
      }
    }
  });
}

/*RPC 결과 토스트 메세지*/
var csApp = {
   toastZone: document.getElementById('toast'),
   closing: 0,
   count: 0,
   makeToast: function(txt, err){
      csApp.count += 1
      //Container
      var newToast = document.createElement('div');
      newToast.classList.add('toast');
      newToast.classList.add('up');
      newToast.setAttribute('id', csApp.count);
      if(err) newToast.style['background-color']    = "#870073";

      var textArea = document.createElement('span');
      textArea.innerHTML = txt;
      var closeButton = document.createElement('span');
      closeButton.setAttribute('onclick', 'csApp.closeToast(this)');
      closeButton.innerHTML = 'X';

      textArea.appendChild(closeButton);
      newToast.appendChild(textArea);
      csApp.toastZone.appendChild(newToast);
   },
   closeToast: function(ele){
      var toast = ele.parentElement.parentElement;
      toast.classList.add('toastClose');
      setTimeout(function(){
         toast.style.display = "none";
      }, 500);
   }
};

function setDefaultRPC(vid){
  let msg = $('#dialogRequest textarea').val();
  if(msg != '') return;

  var defaultParam = {
    "method": "activationReq",
    "params": {
      "vid": vid,
      "upp": 10,
      "elt": 300,
      "fut":1,
      "mty":1,
      "cyl":1
    }
  };

  $('#dialogRequest textarea').val(JSON.stringify(defaultParam, null, 4));
}
