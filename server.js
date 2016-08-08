var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var morgan = require('morgan');

//APP CONFIG
//set view engine to ejs
app.set('view engine', 'ejs');
//set public directory for assets
app.use(express.static('public'));
//use bodyParser to get values from forms
app.use(bodyParser.urlencoded({extended: true}));
//use method-override to update form methods
app.use(methodOverride("_method"));
//use moment.js for date handling via app.locals
app.locals.moment = require('moment');
//log requests to the console
app.use(morgan('dev'));

//DB SETUP
var dburl = process.env.DATABASEURL || 'mongodb://localhost/newsletter_app';
//Set up Mongoose
mongoose.connect(dburl);
// Import db models
var Post = require('./models/post');
var Comment = require('./models/comment');
var Event = require('./models/event');

//SET UP ROUTES
//HOME
app.get("/", function(req, res) {
  res.redirect("/posts");
});

// ======================================
// ROUTES FOR POSTS
// ======================================

//INDEX
app.get("/posts", function(req, res) {
  Post.find().where('state').equals('published').exec(function(err, allPosts) {
    if(err) {
      console.log(err);
    } else {
      //reverse the posts array so that they are ordered from newest to oldest
      var reversedPosts = allPosts.reverse();
      //create a new array with all arrays apart from the current one posts[0]
      var previousPosts = reversedPosts.slice(1);
      //create a variable for the current post to use as the banner post
      var mainPost = allPosts[0];
      res.render("posts/index", {mainPost: mainPost, posts: previousPosts})
    }
  });
});

//NEW
app.get("/posts/new", function(req, res) {
  var stateOptions = [{"option": "Select the post state", "value": ""},{"option": "Draft", "value": "draft"},{"option": "Published", "value": "published"}];
  res.render("posts/new", {stateOptions: stateOptions});
});

//CREATE
app.post("/posts", function(req, res) {
  var post = req.body.post;
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
          console.log(events);
          res.render("posts/show", {post: foundPost, events: events});
        }
      });
    }
  });
});

//EDIT
app.get("/posts/:id/edit", function(req, res) {
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
  var updatedPost = req.body.post;
  Post.findByIdAndUpdate(id, updatedPost, function(err, updatedPost) {
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
      console.log(allEvents);
      res.render("events/index", {events: allEvents});
    }
  });
});

//NEW event form
app.get("/events/new", function(req, res){
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
app.get("/events/:id/edit", function(req, res){
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
// ROUTES FOR ADMINS
// =========================================

//ALL posts for admin view
app.get("/posts/all", function(req, res) {
  Post.find({}).sort('-createdAt').exec(function(err, allPosts) {
    if(err) {
      console.log(err);
    } else {
      res.render("posts/all", {posts: allPosts});
    }
  });
});

//SET PORT AND RUN SERVER
var port = process.env.PORT || 8080;
app.listen(port);
console.log("Looks like we're cooking on port " + port);
