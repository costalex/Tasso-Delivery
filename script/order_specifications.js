function order_specifications() {
  if (document.getElementById("recipient_phone").value == "") {
    document.getElementById("secure_code_option").checked = false;
    document.getElementById("secure_code_option").disabled = true;
  }

  if (document.getElementById("secure_code_option").checked == true) {
    document.getElementById("signature_option").checked = false;
    document.getElementById("signature_option").disabled = true;
  }
  else if (document.getElementById("secure_code_option").checked == false) {
    document.getElementById("signature_option").disabled = false;
  }

  if (document.getElementById("signature_option").checked == true) {
    document.getElementById("secure_code_option").checked = false;
    document.getElementById("secure_code_option").disabled = true;
  }
  else if (document.getElementById("signature_option").checked == false) {
    document.getElementById("secure_code_option").disabled = false;
  }
}
