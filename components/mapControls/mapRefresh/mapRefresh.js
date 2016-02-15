angular.module('myApp.mapControls')
    .controller('mapRefreshCtrl', ['$scope', '$interval', function ($scope, $interval) {
        $scope.countdownTime = 30;
		$scope.$on('resetCountdownTime', function (event, startTime) { 
			$scope.countdownTime = startTime;
		});
		var updateCountdown = function() {
			if ($scope.countdownTime == 0) return;
			$scope.countdownTime--;			
		}
		$interval(updateCountdown, 1000);
    }]);