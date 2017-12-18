function fnLogin(){
  let id = input_id.value,
    pw = input_pw.value;

  var data = {"username":id,"password":pw} ;

  /*Get Token*/
  $.ajax({
    type: "POST",
    url: "/login/auth",
    contentType: 'application/json',
    data: JSON.stringify(data),
    success: function(d){
      Object.keys(d).map(function(objectKey, index) {
        sessionStorage.setItem(objectKey, d[objectKey]);
      });
      location.href = '/app';
    },
    error : function(err){
      let str = err.responseJSON.error;
      if(typeof err.responseJSON.detail == 'object') str += '\n[CAUSE] '+err.responseJSON.detail.message;
      alert(str);
    }
  });
}
