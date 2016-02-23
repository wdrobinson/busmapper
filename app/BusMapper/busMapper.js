'use strict';

angular.module('myApp.busMapper', ['ngRoute', 'uiGmapgoogle-maps', 'ngGeolocation'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/:city', {
    templateUrl: 'BusMapper/busMapper.html',
    controller: 'BusMappterCtrl'
  });
}])

.controller('BusMappterCtrl', ['$scope', 'busFactory', '$timeout', '$route', '$rootScope', '$interval', '$geolocation', 'sharedData', function ($scope, busFactory, $timeout, $route, $rootScope, $interval, $geolocation, sharedData) {
    var countdownInterval;
    $scope.buses = [];
    $scope.stops = [];
    $scope.stopWindow = {};
    $scope.trip = {
        path: [],
        stroke: {
            color: '#BD2031',
            weight: 2
        },
        icons: [{
            icon: {
                path: google.maps.SymbolPath.FORWARD_OPEN_ARROW,
                scale: 2,
                strokeColor: '#BD2031',
                strokeWeight: 2,
            },
            repeat: '100px',
        }]       
    };    

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
        if (sharedData.countdown > 0) {
            sharedData.countdown--;
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

    var redCircle = {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: '#BD2031',
        fillOpacity: 1,
        scale: 7,
        strokeColor: 'white',
        strokeWeight: 1
    };

    var redCircleSmall = {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: '#BD2031',
        fillOpacity: 1,
        scale: 3,
        strokeColor: 'white',
        strokeWeight: 1
    };

    $scope.locationMarker = {
        id: 'locationMarker',
        options: {
            clickable: false,
            cursor: 'pointer',
            draggable: false,
            flat: true,
            optimized: false, 
            title: 'Current location',
            zIndex: 2,
            icon: {
                url: 'https://google-maps-utility-library-v3.googlecode.com/svn/trunk/geolocationmarker/images/gpsloc.png',
                size: new google.maps.Size(34, 34),
                scaledSize: new google.maps.Size(17, 17),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(8, 8)
            }            
        }
    };   

    $scope.locationCircle = {
        clickable: false,
        radius: 0,
        stroke: {
            color: '#1bb6ff',
            opacity: .4,
            weight: 1
        },
        fill: {
            color: '#61a0bf',
            opacity: .4,
        }
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
            //console.log('Bus count: ' + responseData.length);
            removeDeadBuses(responseData);
            updateBusPositions(responseData);
            $timeout(getBusPositions, 30000);
            sharedData.countdown = 30;
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
                var trip = findTrip(busData.tripId);
                if (trip.length == 0) return;
                $scope.buses.push(createBus(busData, trip[0]));
            } else {
                var bus = findBus[0]; 
                bus.latitude = busData.latitude;
                bus.longitude = busData.longitude;
                if (bus.tripId != busData.tripId) {
                    var trip = findTrip(busData.tripId);
                    if (trip.length == 0) {
                        removeBus(bus);
                    };
                    bus.tripId = busData.tripId;
                    bus.options.label = trip[0].routeId + ' - ' + trip[0].tripName;
                };
            }    
        };   
        sharedData.busCount = $scope.buses.length;
    }

    var findTrip = function(tripId) {
        return $.grep(trips, function(e){ return e.tripId == tripId; });
    }    

    var createBus = function(busData, trip) {
        //console.log('createBus');
        var bus = {
            id: busData.label,
            latitude: busData.latitude,
            longitude: busData.longitude,
            icon: blueCircle,
            options: {
                label: trip.routeId + ' - ' + trip.tripName,
            },
            tripId: trip.tripId,
            shapeId: trip.shapeId
        };   
        return bus;  
    }

    var removeBus = function (bus) {
        //console.log('Removing bus');
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

    $scope.busMarkerClick = function (marker, event, bus) {
        for (var i = $scope.buses.length - 1; i >= 0; i--) {
            if ($scope.buses[i].icon == redCircle) {
                $scope.buses[i].icon = blueCircle;
            }                
        }
        bus.icon = redCircle;
        viewTrip(bus);
    }

    var viewTrip = function (bus) {
        $scope.stops = [];
        $scope.trip.path = [];
        $scope.stopWindow.visible = false;
        busFactory.getShape(bus.shapeId).success(function (data) {            
            for (var i = 0; i < data.length; i++) {
                $scope.trip.path.push({ latitude: data[i].latitude, longitude: data[i].longitude });
            }
        });
        busFactory.getTripStops(bus.tripId).success(function (data) {
            for (var i = 0; i < data.length; i++) {
                $scope.stops.push({ 
                    id: i,
                    latitude: data[i].latitude,
                    longitude: data[i].longitude,
                    icon: redCircleSmall,
                    tripId: bus.tripId,
                    stopId: data[i].stopId,
                    options: {
                        title: data[i].stopName
                    }
                });
            }
        });        
    }

    $scope.busStopMarkerClick = function (marker, event, stop) {
        busFactory.getStopTimes(stop.stopId, stop.tripId).success(function (data) {           
            var dateParts = data.toString().split(':');
            var dateString = '';
            var ampm = 'AM';
            if (dateParts[0] <= 12) {
                dateString += dateParts[0];
            } else {
                dateString += dateParts[0] - 12;
                ampm = 'PM';
            }
            dateString += ':' + dateParts[1] + " " + ampm;
            $scope.stopWindow = {
                coords: {
                    latitude: stop.latitude,
                    longitude: stop.longitude
                },
                visible: true,
                stopTitle: stop.options.title,
                arrivalTime: dateString
            };
        });        
    }

    $geolocation.watchPosition({
      timeout: 60000,
      maximumAge: 2,
      enableHighAccuracy: true
    });

    $scope.$on('$geolocation.position.changed', function(event, newPosition) {
        var coords = {latitude: newPosition.coords.latitude, longitude: newPosition.coords.longitude}
        $scope.locationMarker.coords = coords;
        $scope.locationCircle.center = coords;
        $scope.locationCircle.radius = $geolocation.position.coords.accuracy;
    });

}]);