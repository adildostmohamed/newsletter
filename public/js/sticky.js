var makeSticky = (function($){
  return {
    isFixed: function(target){
      var offsetHeight = $(target).offset().top;
      var targetHeight = $(target).outerHeight();
      $(window).scroll(function() {
        var scrollPos = $(window).scrollTop();
        if(scrollPos >= offsetHeight){
          $(target).addClass('is-fixed');
          $('body').css({'padding-top': targetHeight});
        } else {
          $(target).removeClass('is-fixed');
          $('body').css({'padding-top': 0});
        }
      });
    }
  };
})(jQuery);

makeSticky.isFixed('.post-header__date-wrapper');
