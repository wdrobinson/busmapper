angular.module('myApp.mapControls')
    .controller('mapInfoCtrl', ['$scope', 'sharedData', '$routeParams', function ($scope, sharedData, $routeParams) {
    	$scope.city = $routeParams.city;
        $scope.sharedData = sharedData;
    }]);