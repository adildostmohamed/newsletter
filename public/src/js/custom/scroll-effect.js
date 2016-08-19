var changeStyle = (function($){
  return {
    isScrolling: function(targetScroll, targetDisplay, cssProperty, startCssValue, endCssValue, cssUnit){
      //get the px value at which the css change should start
      var targetOffsetHeight = $(targetScroll).offset().top;
      // get the number of px for which the css change should take effect based on the height of the target element
      var targetHeight = $(targetScroll).outerHeight();
      //calculate the difference in css values from start to the end of the scroll
      var cssDifference = endCssValue - startCssValue;
      //calculate the change in css property per change in px of scroll
      var changePerPx = cssDifference/targetHeight;
      //fire the following event every time the window scroll event is fired
      $(window).scroll(function() {
        //get the scroll position in px from the top
        var scrollPos = $(window).scrollTop();
        //calculate the current scroll value minus any amount of offset from the top that needs to be applied if the target scrolling element is not at the top of the page
        var scrollCssValue = scrollPos - targetOffsetHeight;
        //fire the function below if the current scroll value is greater than the height at which the scroll css change should be applied
        if(scrollPos >= targetOffsetHeight) {
          //calculate the css value of the target element by adding in the expected css value for the given scroll point plus the starting css value for the element
          $(targetDisplay).css(cssProperty, ((startCssValue + scrollCssValue * changePerPx) + cssUnit));
        } else {
          return false;
        }
      });
    }
  };
})(jQuery);

changeStyle.isScrolling(".post-header", ".post-header", "opacity", 1, 1, "");
changeStyle.isScrolling(".post-header", ".post-header__title", "opacity", 1, 0, "");
changeStyle.isScrolling(".post-header", ".post-header__title", "top", 150, 25, "px");
changeStyle.isScrolling(".post-header", ".post-header__fade-wrapper", "opacity", 0, 0.8, "");
changeStyle.isScrolling(".post-header", ".navigation__fade-wrapper", "opacity", 0, 1, "");
changeStyle.isScrolling(".post-header", ".post-header__image", "width", 40, 5, "%");
changeStyle.isScrolling(".post-header", ".post-header__image", "opacity", 0.2, 0, "");
