function display_sweetAlert(type) {
  //console.log("type message: ", type);

  if (type == "info") {
    swal(
      'Atention!',
      'Vous êtes déjà inscrit!',
      'info'
    )
  }
  else if (type == "error") {
    swal(
      'Erreur!',
      'Une erreur est survenue!',
      'error'
    )
  }
  else if (type == "success") {
    swal(
      'Bravo!',
      'You clicked the button!',
      'success'
    )
  }
}


//A remettre dans le footer lrosde l'integration de sweet alert
// <script type="text/javascript" src="../script/display_newsletter_alert.js"></script>
// <script type="text/javascript">
//   if ("<%= type %>" != "") {
//     console.log("type: ", "<%= type %>");
//     display_sweetAlert("<%= type %>");
//   }
// </script>
// 
// <script type="text/javascript" src="dist/sweetalert2.min.js"></script>
// <link rel="stylesheet" type="text/css" href="dist/sweetalert2.css">
