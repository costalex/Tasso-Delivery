function initElements(ww,  wh){
  $(".ticket").each(function() {
    var left_pos = Math.round(Math.random() * ww) - 0;
    var top_pos = Math.round(Math.random() * wh) - 0;
    $(this).css("top", top_pos + "px").css("left", left_pos + "px");
  });
}

function updateElements(ww, wh, i) {
  $(".ticket").each(function(i) {
    var elem = document.getElementById("block_" + (i + 1));
    var top_prop = window.getComputedStyle(elem , null).getPropertyValue("top").replace('px', '');
    var left_prop = window.getComputedStyle(elem , null).getPropertyValue("left").replace('px', '');

    var left_pos = Number(left_prop) + Math.random() * (300 - 100);

    if (left_pos > ww - 200) {
      $(this).hide();
      left_pos = 0;
    }
    else if (left_pos > 0) {
      $(this).show();
    }
    var top_pos = Math.random() * (wh) - 0;

    $(this).animate({
      left: left_pos,
      top: top_pos,
      easing: "swing"
    });

    $(this).css("top", top_pos + "px").css("left", left_pos + "px");
    i++;
  });
}

var ww = document.getElementById('our_clients').offsetWidth;
var wh = document.getElementById('our_clients').offsetHeight;
initElements(ww, wh);
setInterval(function() {
  updateElements(ww, wh, 0);
}, 900);
