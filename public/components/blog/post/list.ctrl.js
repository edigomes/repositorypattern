app.controller("PostCtrl", function ($scope, $resource) {

    var Post = r = $resource('/api/post/:id', {id: "@id"}, {
        getArray: {
            method:'GET', isArray: true
        },
        save: {
            method:'PUT'
        },
        create: {
            method:'POST'
        }
    });
    
    $scope.post = new Post;
    
    $scope.loadPosts = function() {
        Post.getArray(function(data) {
            $scope.data = data;
        });
    };
    
    $scope.edit = function(id) {
        $scope.post.$get({id: id}, function() {
            $scope.loadPosts();
        });
    };
    
    $scope.save = function() {
        if ($scope.post.id) {
            $scope.post.$save(function() {
                $scope.loadPosts();
            });
        } else {
            $scope.post.$create(function() {
                $scope.loadPosts();
            });
        }
    };
    
    $scope.loadPosts();
    
});