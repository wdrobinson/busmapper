angular.module('myApp.mapControls')
    .controller('mapInfoCtrl', ['$scope', 'sharedData', function ($scope, sharedData) {
        $scope.sharedData = sharedData;
    }]);