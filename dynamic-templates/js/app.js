angular.module('myApp', [])
.controller('ContentCtrl',function ($scope, $http) {

    $scope.url = 'content.json';
    $scope.content = [];

    $scope.fetchContent = function() {
        $http.get($scope.url).then(function(result){
            $scope.content = result.data;
        });
    }

    $scope.fetchContent();
})
.directive('contentItem', function ($compile, $templateCache) {

    var getTemplate = function(contentType) {
        var template = '';

        switch(contentType) {
            case 'image':
                template = $templateCache.get("image.html");
                break;
            case 'video':
                template = $templateCache.get("video.html");
                break;
            case 'notes':
                template = $templateCache.get("notes.html");
                break;
        }

        return template;
    }

    var linker = function(scope, element, attrs) {
        scope.rootDirectory = 'images/';

        element.html(getTemplate(scope.content.content_type)).show();

        $compile(element.contents())(scope);
    }

    return {
        restrict: "E",
        link: linker,
        scope: {
            content:'='
        }
    };
});
