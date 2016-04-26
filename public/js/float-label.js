(function($){
  $('.input-float').focusin(function(){
    $(this).prev('.label-float-js').addClass('label-float--active');
  });
  $('.input-float').focusout(function(){
    if($(this).val().length === 0) {
      $(this).prev('.label-float-js').removeClass('label-float--active');
    }
  });
  $('.input-float').each(function(){
    if($(this).val().length > 0) {
      $(this).prev('.label-float-js').addClass('label-float--active');
    }
  });
})(jQuery);
