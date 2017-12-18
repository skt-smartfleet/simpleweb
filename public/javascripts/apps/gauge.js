function makeSpeedometer(min, max, idName, unit) {
  var interval = (min+max)/8/*Math.round((min+max)/8)*/;
  $('#'+idName).append('<div class="center round gauge-board">'
    +'<div class="center gauge-color-bar">'
      +'<div class="center round gauge-yellow-bar"></div>'
      +'<div class="center round gauge-green-bar"></div>'
      +'<div class="center round gauge-red-bar"></div>'
    +'</div>'
    +'<div class="center gauge-white-bar"></div>'
    +'<div class="center gauge-pointer">'
      +'<div class="center round gauge-knot"></div>'
      +'<div class="center gauge-arm"></div>'
    +'</div>'
    +'<div class="center gauge-bars">'
      +'<div class="bar center">'
      +'</div>'
      +'<div class="bar center">'
      +'</div>'
      +'<div class="bar center">'
      +'</div>'
      +'<div class="bar center">'
      +'</div>'
      +'<div class="bar center">'
      +'</div>'
      +'<div class="bar center">'
      +'</div>'
      +'<div class="bar center">'
      +'</div>'
      +'<div class="bar center">'
      +'</div>'
      +'<div class="bar center">'
      +'</div>'
      +'<div class="bar center">'
      +'</div>'
      +'<div class="bar center">'
      +'</div>'
      +'<div class="bar center">'
      +'</div>'
      +'<div class="bar center">'
      +'</div>'
      +'<div class="bar center">'
      +'</div>'
      +'<div class="bar center">'
      +'</div>'
      +'<div class="bar center">'
      +'</div>'
      +'<div class="bar center">'
      +'</div>'
      +'<div class="bar center">'
      +'</div>'
      +'<div class="bar center">'
      +'</div>'
      +'<div class="bar center">'
      +'</div>'
      +'<div class="bar center">'
      +'</div>'
      +'<div class="bar center">'
      +'</div>'
      +'<div class="bar center">'
      +'</div>'
      +'<div class="bar center">'
      +'</div>'
      +'<div class="bar center">'
      +'</div>'
      +'<div class="bar center">'
      +'</div>'
      +'<div class="bar center">'
      +'</div>'
      +'<div class="bar center">'
      +'</div>'
      +'<div class="bar center">'
      +'</div>'
      +'<div class="bar center">'
      +'</div>'
      +'<div class="bar center">'
      +'</div>'
      +'<div class="bar center">'
      +'</div>'
      +'<div class="bar center">'
      +'</div>'
    +'</div>'
    +'<div class="center gauge-numbers">'

    +'</div>'
    +'<div class="center gauge-values">'
      +'<div class="gauge-box">'+min.toFixed(1)+'</div>'
      +'<div class="gauge-unit">'+unit+'</div>'
    +'</div>'
  +'</div>');

  for(var i=0; i<8; i++){
    let num = Math.round(min + interval*i);
    $('#'+idName+' .gauge-numbers').append('<div class="num center">'+num+'</div>');
  }
  $('#'+idName+' .gauge-numbers').append('<div class="num center">'+max+'</div>');
}

function chgSpeed(idName, val){
  let min = $('#'+idName).find('.gauge-numbers > .num:first').text();
  let max = $('#'+idName).find('.gauge-numbers > .num:last').text();

  let angle = ( (val/(max-min))*270 ) - 45;
  if(val > max) angle = 230
  else if (val < min) angle = -50;

  $('#'+idName+' .gauge-arm').css({
    "transform": "translate(-85%, -50%) rotate("+angle+"deg)",
    "-webkit-transform": "translate(-85%, -50%) rotate("+angle+"deg)",
    "-moz-transform": "translate(-85%, -50%) rotate("+angle+"deg)"
  });
  $('#'+idName+' .gauge-box').text(val.toFixed(1));
  console.log('#'+idName+' .gauge-box', val.toFixed(1));
}

function chgVoltage(idName, val){
  let max = 15;
  let per = (val/max)*100;
  $('.voltage .graph-bar').css({
    "height" : per+"%"
  });
  $('.voltage .txt strong').text(val.toFixed(1));
}

function chgTemp(idName, val){
  let max = 100;
  let per = (val/max)*100;
  $('.temperature .graph-bar').css({
    "height" : per+"%"
  });
  $('.temperature .txt strong').text(val.toFixed(1));
}
