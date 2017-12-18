$(document).ready(function(){
  let token = sessionStorage.getItem('token');
  if(token == null){
    /*인증 실패 시*/
    location.href = '/login';
  } else {
    /*인증 성공*/
    location.href = '/app';
  }
});
