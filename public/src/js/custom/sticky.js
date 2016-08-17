// var makeSticky = (function($){
//   return {
//     isFixed: function(target){
//       if($(target).length){
//         var offsetHeight = $(target).offset().top;
//         var targetHeight = $(target).outerHeight();
//         $(window).scroll(function() {
//           var scrollPos = $(window).scrollTop();
//           if(scrollPos >= offsetHeight){
//             $(target).addClass('is-fixed');
//             $('body').css({'padding-top': targetHeight});
//           } else {
//             $(target).removeClass('is-fixed');
//             $('body').css({'padding-top': 0});
//           }
//         });
//       } else {
//         return false;
//       }
//     }
//   };
// })(jQuery);
//
// makeSticky.isFixed('.post-header__date-wrapper');
