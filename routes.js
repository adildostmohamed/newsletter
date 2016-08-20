// Import db models
var Post = require('./models/post');
var Comment = require('./models/comment');
var Event = require('./models/event');
var express = require('express');
var app = express();

module.exports = function(app, passport) {
  // =======================================
  // SET UP ROUTES
  // =======================================

  //HOME
  app.get("/", function(req, res) {
    res.redirect("/posts");
  });

  // ======================================
  // ROUTES FOR POSTS
  // ======================================

  //INDEX
  app.get("/posts", function(req, res) {
    Post.find().where('content.state').equals('published').exec(function(err, allPosts) {
      if(err) {
        console.log(err);
      } else {
        //reverse the posts array so that they are ordered from newest to oldest
        var reversedPosts = allPosts.reverse();
        //create a new array with all arrays apart from the current one posts[0]
        var previousPosts = reversedPosts.slice(1);
        //create a variable for the current post to use as the banner post
        var mainPost = allPosts[0];
        res.render("posts/index", {mainPost: mainPost, posts: previousPosts});
      }
    });
  });

  //NEW
  app.get("/posts/new", isLoggedIn, function(req, res) {
    var stateOptions = [{"option": "Select the post state", "value": ""},{"option": "Draft", "value": "draft"},{"option": "Published", "value": "published"}];
    res.render("posts/new", {stateOptions: stateOptions});
  });

  //CREATE
  app.post("/posts", function(req, res) {

    //randomly generate the template number to use by passing in the lowest and highest number of templates
    function generateTemplate(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    //randomly select a template for this particular post that's being saved
    var postTemplate = generateTemplate(1, 8);

    //get the content of the post fromt the body of the request which is nested inside the post
    var postContent = req.body.post.content;

    //construct a post object by setting the content and the template so that you can use it when you call Model.create in mongoose
    var post = {content: postContent, template: postTemplate};

    //create a post using mongoose and if successful redirect to the newly created post
    Post.create(post, function(err, newPost) {
      if(err) {
        console.log(err);
      } else {
        res.redirect("/posts/" + newPost.id);
      }
    });
  });

  //SHOW
  app.get("/posts/:id", function(req, res) {
    var id = req.params.id;
    var currentDate = Date.now();
    Post.findById({_id: id}).populate('comments').exec(function(err, foundPost){
      if(err) {
        console.log(err);
      } else {
        //add another query in the callback to get the events data to render to the template
        Event.find({}).where('date.end').gte(currentDate).sort('date.end').limit(5).exec(function(err, events) {
          if(err) {
            console.log(err);
          } else {
            res.render("posts/show", {post: foundPost, events: events});
          }
        });
      }
    });
  });

  //EDIT
  app.get("/posts/:id/edit", isLoggedIn, function(req, res) {
    var id = req.params.id;
    var stateOptions = [{"option": "Select the post state", "value": ""},{"option": "Draft", "value": "draft"},{"option": "Published", "value": "published"}];
    Post.findById({_id: id}, function(err, editPost){
      if(err) {
        console.log(err);
      } else {
        res.render("posts/edit", {post: editPost, stateOptions: stateOptions});
      }
    });
  });

  //UPDATE
  app.put("/posts/:id", function(req, res) {
    var id = req.params.id;
    var updatedPostContent = req.body.post.content;
    Post.findByIdAndUpdate(id, {$set: { content: updatedPostContent }}, function(err, updatedPost) {
      if(err) {
        console.log(err);
      } else {
        res.redirect("/posts/" + id);
      }
    });
  });

  //DESTROY
  app.delete("/posts/:id", function(req, res) {
    var id = req.params.id;
    Post.findByIdAndRemove(id, function(err, deletedPost) {
      if(err) {
        console.log(err);
      } else {
        res.redirect('/posts');
      }
    });
  });

  // ======================================
  // ROUTES FOR COMMENTS
  // ======================================

  //NEW comment
  app.get("/posts/:id/comments/new", function(req,res){
      Post.findById(req.params.id, function(err, post){
        if(err){
          console.log(err);
        } else {
          res.render('comments/new', {post: post});
        }
      });
  });

  //CREATE comment
  app.post("/posts/:id/comments", function(req, res){
    var comment = req.body;
    Post.findById(req.params.id, function(err, post){
      if(err){
        console.log(err);
      } else {
        Comment.create(comment, function(err, newComment){
          if(err) {
            console.log(err);
          } else {
            post.comments.push(newComment);
            post.save(function(err, savedPost){
              if(err){
                console.log(err);
              } else {
                res.json(newComment);
                // res.redirect("/posts/" + post._id + "#comments");
              }
            });
          }
        });
      }
    });
  });

  // =========================================
  // ROUTES FOR EVENTS
  // =========================================

  //INDEX for all events
  app.get("/events", function(req, res){
    var currentDate = Date.now();
    Event.find({}).where('date.end').gte(currentDate).sort('date.end').exec(function(err, allEvents){
      if(err) {
        console.log(err);
      } else {
        res.render("events/index", {events: allEvents});
      }
    });
  });

  //NEW event form
  app.get("/events/new", isLoggedIn, function(req, res){
    res.render("events/new");
  });

  //CREATE an event
  app.post("/events", function(req, res){
    var event = req.body.event;
    Event.create(event, function(err, newEvent){
      if(err) {
        console.log(err);
      } else {
        res.redirect("/events");
      }
    });
  });

  //EDIT event form
  app.get("/events/:id/edit", isLoggedIn, function(req, res){
    var id = req.params.id;
    Event.findById({ _id: id}, function(err, editEvent){
      if(err) {
        console.log(err);
      } else {
        res.render("events/edit", { event: editEvent });
      }
    });
  });

  //UPDATE event
  app.put("/events/:id", function(req, res){
    var updatedEvent = req.body.event;
    Event.findByIdAndUpdate(req.params.id, updatedEvent, function(err, updatedEvent){
      if(err) {
        console.log(err);
      } else {
        res.redirect("/events")
      }
    });
  });

  // =========================================
  // ROUTES FOR AUTHENTICATION
  // =========================================

  //Login route
  app.get('/login', function(req, res) {
    // render the page and pass in any flash data if it exists
    res.render('authentication/login', { message: req.flash('loginMessage') });
  });

  //Handle the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/admin/posts', // redirect to the homepage
    failureRedirect : '/login', // redirect back to the login page if there is an error
    failureFlash : true // allow flash messages
  }));

  //Signup form route
  app.get('/register', function(req, res) {
    // render the page and pass in any flash data if it exists
    res.render('authentication/registration', { message: req.flash('signupMessage') });
  });

  // Handle the registration form
  app.post('/register', passport.authenticate('local-signup', {
    successRedirect : '/admin/posts', // redirect to the homepage section
    failureRedirect : '/register', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

  // Handle logout
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login');
  });

  // =========================================
  // ROUTES FOR ADMINS
  // =========================================

  //ALL posts for admin view
  app.get("/admin/posts",isLoggedIn, function(req, res) {
    Post.find({}).sort('-createdAt').exec(function(err, allPosts) {
      if(err) {
        console.log(err);
      } else {
        res.render("posts/all", {posts: allPosts});
      }
    });
  });
}

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.redirect('/login');
}
