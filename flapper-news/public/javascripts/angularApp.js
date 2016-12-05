var app = angular.module('flapperNews',[]);
angular.module('flapperNews',['ui.router'])

app.controller('MainCtrl',[
  '$scope',
  'posts',
  function($scope,posts){
  $scope.test = "Hello world!";
  $scope.posts = posts.posts;
  $scope.addPost = function(){
    if(!$scope.title ||$scope.title ==='')
    {return;}
    posts.push({
      title: $scope.title,
      link: $scope.link,
      upvotes:0,
    comments:[
    //  {author: 'Joe', body: 'Cool post!', upvotes: 0},
      //{author: 'Bob', body: 'Great idea but everything is wrong!', upvotes: 0}
    ]
  });
    posts.create({
      title: $scope.title,
      link : $scope.link,
    });
    $scope.title = '';
    $scope.link = '';
    }

$scope.incrementUpvotes = function(post){
  post.upvote(post);
  posts.upvoteComment(post,comment);
};
}]);

app.controller('PostCtrl',[
  '$scope',
  '$stateParams',
  'posts',
  function($scope,$stateParams,$posts){
$scope.post = post;
  }
]);

app.config([
  '$stateProvider',
  '$urlRouterProvider',
  function($stateProvider,$urlRouterProvider){

    $stateProvider.state('home',{
      url: '/home',
      templateUrl:'/home.html',
      controller:'MainCtrl',
      resolve:{
        postPromise:['posts',function(posts){
          return posts.getAll();
        }]
      }
    }).state('posts',{
      url:'/posts/{id}',
      templateUrl:'/posts.html',
      controller: 'PostCtrl',
      resolve:{
        post: ['$stateParams','posts',function($stateParams,posts){
          return posts.get($stateParams.id);
        }]
      }
    });

    $urlRouterProvider.otherwise('home');
  }]);



app.factory('posts',['$http',function($http){
  var o = {
    posts:[
      {title:'post 1',upvotes: 5},
      {title:'post 2',upvotes: 2},
      {title:'post 3',upvotes: 15},
      {title:'post 4',upvotes: 9},
      {title:'post 5',upvotes:4}
    ]
  };
  o.getAll = function(){
    return $http.get('/posts').succes(function(data){
      angular.copy(data,o.posts);
    });
  };
  o.create = function(post){
    return $http.post('/posts',post).succes(function(data){
      o.posts.push(data);
    });
  };
  o.upvote = function(post){
    return $http.put('/posts/' + post._id + '/upvote')
    .succes(function(data){
      post.upvotes +=1;
    });
  };
  o.get = function(id){
    return $http.get('/posts/' + id).then(function(res){
      return res.data;
    });
  };
  o.addComment = function(){
    if($scope.body ===''){return;}
    posts.addComment(post._id,{
      body: $scope.body,
      author: 'user',
    }).succes(function(comment){
      $scope.post.comments.push(comment);
    });
    $scope.body = '';
  };
  o.upvoteComment = function(post,comment){
    return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/upvotes/')
    .succes(function(data){
      comment.upvotes +=1;
    });
  };
//return o;
}]);
