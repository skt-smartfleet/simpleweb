/*콘솔 출력 fnConsole(텍스트, 텍스트색상)*/
function fnConsole(str, color){
  var dt = new Date();
  dt.setHours(dt.getHours() + 9);
  date = dt.toISOString().replace("T"," ").replace("Z","");
  var log = '['+date+']';
  if(typeof str == 'object') log += JSON.stringify(str, null, 4);
  else log += str;
  var node = document.createElement("pre");
  var textnode = document.createTextNode(log);
  node.appendChild(textnode);
  if(typeof color != 'undefined') node.style.color = color;
  var paragraph = document.getElementById("consoleArea");
  paragraph.prepend(node);
}

/*트래킹 이벤트 출력*/
function fnEventLoging(ts, v, micro){
  var dt = new Date(ts);
  dt.setHours(dt.getHours() + 9);
  var date = dt.toISOString().replace("T"," ").replace("Z","");

  micro.forEach((micro, index) => {
    micro.event.forEach((e, index) => {
      var add_cell = '<tr>'
        +"<td>"+date+"</td>"
        +"<td class='left'>"+micro.addressInfo+"</td>"
        +"<td>"+v+"</td>"
        +"<td>"+e+"</td>"
        +'</tr>';
      $('.traffic-list').append(add_cell);
    });
  });
}
