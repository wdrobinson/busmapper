angular.module('myApp.mapControls')
    .controller('mapRefreshCtrl', ['$scope', function ($scope) {
        $scope.countdownTime = 30;
		$scope.$on('setCountdownTime', function (event, time) { 
			$scope.countdownTime = time;
		});
    }]);