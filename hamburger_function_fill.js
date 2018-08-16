$(".hamburger").click(function() {
    if ($(".mobile-navigation").is(":visible")) {
      $(".mobile-navigation").fadeOut(350);
      $('body').css({overflow: "auto"});
      $('html').css({overflow: "auto"});
    } else {
      $(".mobile-navigation").fadeIn(350);
      $('body').css({overflow: "hidden"});
      $('html').css({overflow: "hidden"});
    };
  });
