$( document ).ready(function() {
  $( ".cross" ).hide();
  $( ".responsive-menu" ).hide();

  $( ".hamburger" ).click(function() {
    $( ".responsive-menu" ).slideToggle( "fast", function() {
      $( ".hamburger" ).hide();
      $( ".cross" ).show();
    });
  });

  $( ".cross" ).click(function() {
    $( ".responsive-menu" ).slideToggle( "fast", function() {
      $( ".cross" ).hide();
      $( ".hamburger" ).show();
    });
  });
})
