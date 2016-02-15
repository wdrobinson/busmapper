angular.module('myApp.mapControls')
    .controller('mapTitleCtrl', ['$scope','$routeParams', function ($scope, $routeParams) {
        $scope.city = $routeParams.city;
    }]);