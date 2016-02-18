'use strict';

angular.module('myApp.busMapper', ['ngRoute', 'uiGmapgoogle-maps'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/:city', {
    templateUrl: 'BusMapper/busMapper.html',
    controller: 'BusMappterCtrl'
  });
}])

.controller('BusMappterCtrl', ['$scope', 'busFactory', '$timeout', '$route', '$rootScope', '$interval', function ($scope, busFactory, $timeout, $route, $rootScope, $interval) {
    $scope.buses = [];
    var countdownTime = 30;
    var countdownInterval;

    $scope.map = { 
        center: { latitude: 38.2541667, longitude: -85.7594444 }, 
        zoom: 13,
        options: {
            mapTypeControl: false,
            streetViewControl: false,
            styles: [{ "stylers": [{ "visibility": "on" }, { "saturation": -100 }, { "gamma": 0.54 }] }, { "featureType": "road", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "water", "stylers": [{ "color": "#4d4946" }] }, { "featureType": "poi", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "poi", "elementType": "labels.text", "stylers": [{ "visibility": "simplified" }] }, { "featureType": "road", "elementType": "geometry.fill", "stylers": [{ "color": "#ffffff" }] }, { "featureType": "road.local", "elementType": "labels.text", "stylers": [{ "visibility": "simplified" }] }, { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#ffffff" }] }, { "featureType": "transit.line", "elementType": "geometry", "stylers": [{ "gamma": 0.48 }] }, { "featureType": "transit.station", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "gamma": 7.18 }] }],
        }
    };
    
    var setCountdownTime = function() {
        if (countdownTime >= 0) {
            $rootScope.$broadcast('setCountdownTime', countdownTime--);
        }
    }

    var blueCircle = {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: '#4d66c7',
        fillOpacity: 1,
        scale: 5,
        strokeColor: 'white',
        strokeWeight: 1
    };

    var trips = [];

    busFactory.getTrips().success(function (responseData) {
        trips = responseData;
        getBusPositions();
    });

    var getBusPositions = function () {
        busFactory.getBusPositions().success(function (responseData) {
            if (responseData === 'Currently updating positions') {
                $timeout(getBusPositions, 1000);
                return;
            }
            console.log('Bus count: ' + responseData.length);
            removeDeadBuses(responseData);
            updateBusPositions(responseData);
            $timeout(getBusPositions, 30000);
            countdownTime = 30;
            if (countdownInterval == null) {
                countdownInterval = $interval(setCountdownTime,1000);
            }
        });
    };

    var updateBusPositions = function (buses) {
        for (var i = buses.length - 1; i >= 0; i--) {
            var busData = buses[i];
            var findBus = $.grep($scope.buses, function(e){ return e.id == busData.label; });
            if (findBus.length == 0) {  
                var findTrip = findTrip(busData.tripId);
                if (findTrip.length == 0) return;
                $scope.buses.push(createBus(busData, findTrip[0]));
            } else {
                var bus = findBus[0]; 
                bus.latitude = busData.latitude;
                bus.longitude = busData.longitude;
                if (bus.tripId != busData.tripId) {
                    var findTrip = findTrip(busData.tripId);
                    if (findTrip.length == 0) {
                        removeBus(bus);
                    };
                    bus.tripId = busData.tripId;
                    bus.options.label = findTrip[0].routeId + ' - ' + findTrip[0].tripName;
                };
            }    
        };   
    }

    var findTrip = function(tripId) {
        return $.grep(trips, function(e){ return e.tripId == tripId; });
    }    

    var createBus = function(busData, trip) {
        console.log('createBus');
        var bus = {
            id: busData.label,
            latitude: busData.latitude,
            longitude: busData.longitude,
            icon: blueCircle,
            options: {
                label: trip.routeId + ' - ' + trip.tripName,
            },
            tripId: trip.tripId
        };   
        return bus;  
    }

    var removeBus = function (bus) {
        console.log('Removing bus');
        var index = $scope.buses.indexOf(bus);
        $scope.buses.splice(index, 1);
    }    

    var removeDeadBuses = function (buses) {
        for (var i = $scope.buses.length - 1; i >= 0; i--) {
            var findBus = $.grep(buses, function(e){ return e.label == $scope.buses[i].id; });
            if (findBus.length == 0) {
                removeBus($scope.buses[i]);
            };
        };
    }

}]);