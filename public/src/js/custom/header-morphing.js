(function($){
  var waypoints = $('.editor-output__subheader').waypoint({
    handler: function(direction) {
      $(".navigation__fade-wrapper").toggleClass("bg-is-fancy");
      $(".navigation__title").toggleClass("text-is-fancy");
    },
    offset: 48
  });
})(jQuery);
