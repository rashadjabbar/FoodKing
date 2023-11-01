/* ====================== *
 *  Toggle Between        *
 *  Sign Up / Login       *
 * ====================== */
$(document).ready(function () {
    $("#goRight").on("click", function () {
      $("#slideBox").animate({
        marginLeft: "0"
      });
      $(".topLayer").animate({
        marginLeft: "100%"
      });
    });
    $("#goLeft").on("click", function () {
      if (window.innerWidth > 769) {
        $("#slideBox").animate({
          marginLeft: "50%"
        });
      } else {
        $("#slideBox").animate({
          marginLeft: "0%"
        });
      }
      $(".topLayer").animate({
        marginLeft: "0"
      });
    });
  });
  
 