var value = document.getElementById("option").innerHTML
var img = document.getElementById("img_to_change");

if(value == 1) {
  img.setAttribute("src", "../img/order/secure_code_option.svg");
}
else if(value == 2) {
  img.setAttribute("src", "../img/order/signature_option.svg");
}
else {
  img.setAttribute("src", "../img/order/default_img.png");
}
