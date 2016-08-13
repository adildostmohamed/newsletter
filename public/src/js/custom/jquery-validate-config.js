$(document).ready(function() {
  $("#event-form").validate({
    focusInvalid: false,
    errorElement: "p",
    rules: {
      "event[title]": {
        required: true
      },
      "event[date][start]": {
        required: true
      },
      "event[date][end]": {
        required: true
      },
      "event[contact][email]": {
        email: true
      }
    },
    messages: {
      "event[title]": {
        required: "Please enter a title for the event"
      },
      "event[date][start]": {
        required: "Please enter a start date and time for the event"
      },
      "event[date][end]": {
        required: "Please enter an end date and time for the event"
      }
    },
    invalidHandler: function(event, validator) {
      // 'this' refers to the form
      //get the number of errors from the form
      var errors = validator.numberOfInvalids();

      if (errors > 0) {
        //create an array of error objects
        var errorArray = validator.errorList;

        //remove any existing error messages from the error block
        $('.error-block ul li').remove();

        //iterate over the errors and for each construct an error item that is added to the error-block
        errorArray.forEach(function(errorItem){
          return $("<li><a href=#"+errorItem.element.id+">"+errorItem.message+"</a></li>").appendTo("div.error-block ul");
        });

        //ternary expression to construct an error message for the error block
        var message = errors == 1
          ? 'Please correct the following error to continue'
          : 'Please correct the following ' + errors + ' errors to continue';

        //add the error message to the block
        $("div.error-block h2.error-block__title").html(message);

        //show the error block
        $("div.error-block").show().focus();
      } else {
        $("div.error-block").hide();
      }
    }
  });
  $("#post-form").validate({
    errorElement: "p",
    rules: {
      "post[title]": {
        required: true
      },
      "post[body]": {
        required: true
      },
      messages: {
        "post[title]": {
          required: "Please enter the issue date for this issue"
        },
        "post[body]": {
          required: "Please enter some content for this blog post"
        }
      }
    }
  });
  $("#comment-form").validate({
    errorElement: "p",
    rules: {
      "comment[author]": {
        required: true
      },
      "comment[body]": {
        required: true
      }
    },
    messages: {
      "comment[author]": {
        required: "Please enter your name to commment on this post"
      },
      "comment[body]": {
        required: "Please enter some text for this comment"
      }
    }
  });
});
