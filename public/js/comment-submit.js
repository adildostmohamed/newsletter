$(document).ready(function() {
  var postId = $('header').data('post-id');

  var createPost = function(comment) {
    $('<li><article class="comment-card"><p class="comment-card__author">' + comment.author + '</p><p class="comment-card__date">A moment ago</p><p class="comment-card__body">' + comment.body + '</p></article></li>').prependTo('.comments__list');
  };
  // process the form
  $('#comment-form').submit(function(event) {

      // get the form data
      // there are many ways to get this data using jQuery (you can use the class or id also)
      var commentData = {
          'author'           : $('#comment-author').val(),
          'body'             : $('#comment-body').val()
      };

      console.log(commentData);

      // process the form
      $.ajax({
          type        : 'POST', // define the type of HTTP verb we want to use (POST for our form)
          url         : '/posts/' + postId + '/comments', // the url where we want to POST
          data        : commentData, // our data object
          dataType    : 'json', // what type of data do we expect back from the server
          encode      : true,

      error: function(jqXHR, textStatus, errorThrown) {
              console.log('jqXHR:');
              console.log(jqXHR);
              console.log('textStatus:');
              console.log(textStatus);
              console.log('errorThrown:');
              console.log(errorThrown);
          },

          /**
           * A function to be called if the request succeeds.
           */
          success: function(data, textStatus, jqXHR) {
            console.log(data);
            console.log(data.body);
            createPost(data);
            $('html, body').animate({
              scrollTop: $("#comments").offset().top
            }, 500);
            $('#comment-author').val('').prev('.label-float-js').removeClass('label-float--active');
            $('#comment-body').val('').prev('.label-float-js').removeClass('label-float--active');
          }
        });
      // stop the form from submitting the normal way and refreshing the page
      event.preventDefault();
  });
});