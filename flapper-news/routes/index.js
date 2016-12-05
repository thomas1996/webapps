var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// GET all posts
router.get('/posts',function(req,res,next){
  Post.find(function(err,posts){
    if(err){return next(err);}
    res.json(posts);
  });
});

router.get('/posts/:post',function(req,res,next){
  req.post.populate('comments',function(err,post){
    if(err){return next(err);}

    res.json(post);
  })
})
//post
router.post('/posts',function(req,res,next){
  var post = new Post(req.body);
  post.save(function(err,post){
    if(err){return next(err);}

    res.json(post);
  });
});


router.param('post',function(req,res,next,id){
  var query = Post.findById(id);
  query.exec(function(err,post){
    if(err){return next(err);}
    if(!post){return next(new Error('can\'t find post'));}

    req.post = post;

    return next();
  });
});

router.get('/posts/:post',function(req,res){
  res.json(req.post);
});

router.put('/posts/:post/upvote',function(req,res,next){
  req.post.upvote(function(err,post){
    if(err){return next(err);}
    res.json(post);
  });
});

//comments
router.post('/posts/:post/comments',function(req,res,next){
  var comment = new Comment(req.body);
  comment.post = req.post;

  comment.save(function(err,comment){
    if(err){return next(err);}

    req.post.comments.push(comment);
    req.post.save(function(err,post){
      if(err){return next(err);}

      res.json(comment);
    });
  });
});

router.post('posts/:post/comments/:comment/upvote',function(req,res,next){
var comment = new Comment(req.body);
comment.upvote = req.post;

comment.save(function(err,comment){
  if(err){return next(err);}

  req.comment.upvotes.push(comment);
  req.comment.save(function(err,comment){
    if(err){return next(err);}

    res.json(comment);
  });
});
});

router.param('comment',function(req,res,next,id){
  var query = Comment.findById(id);

  query.exec(function(err,comment){
    if(err){
      return next(err);
    }
    if(!comment)
    {
      return next(new Error('can\'t find menu'));
    }
    req.comment = comment;
    return next();
  });
});



module.exports = router;
