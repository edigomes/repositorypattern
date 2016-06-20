// Fábrica de Api
app.factory("ApiFactory", function($resource) {
    
    // Gera um objeto vazio
    var ApiFactory = {};
    
    // Adiciona a função getApi para trazer a API com a url correta
    ApiFactory.getApi = function(url) {

        var resource = $resource(url, {id: "@id"}, {
            getArray: {
                method: 'GET', isArray: true
            },
            update: {
                method: 'PUT'
            },
            create: {
                method: 'POST'
            }
        });

        // Sobreescreve a função $save para tratar o create ou save quando
        // não existir id no objeto
        resource.prototype.$save = function (sucess, error) {
            if (this.id) {
                this.$update(function () {
                    sucess();
                }, function () {
                    error();
                });
            } else {
                this.$create(function () {
                    sucess();
                }, function () {
                    error();
                });
            }
        };
        
        return resource;
        
    };
    
    // Retorna para o injeção do angular
    return ApiFactory;
    
});

// Gera a API do POST (tanto faz usar service ou factory: pesquisar para entender a diferença)
app.service('Post', function(ApiFactory) {
    return ApiFactory.getApi('/api/post/:id');
});

app.controller("PostCtrl", function ($scope, Post) {

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
        $scope.post.$save(function () {
            $scope.loadPosts();
        });
    };
    
    $scope.loadPosts();
    
});