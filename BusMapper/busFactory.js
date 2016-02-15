angular.module('myApp').factory('busFactory', ['$http', function ($http) {
    var serviceUrl = 'http://pollerbear-001-site3.smarterasp.net';
    return {
        getBusPositions: function () {
            return $http({ method: 'get', url: serviceUrl + '/api/BusApi/GetBusPositions' });
        },
        getTrips: function () {
            return $http({ method: 'get', url: serviceUrl + '/api/BusApi/GetTrips' });
        },
        getTripStops: function (tripId) {
            return $http({ method: 'get', url: serviceUrl + '/api/BusApi/GetTripStops?tripId=' + tripId });
        },
        getShapeGeoJson: function (shapeId) {
            return $http({ method: 'get', url: serviceUrl + '/api/BusApi/GetShapeGeoJson?shapeId=' + shapeId });
        },
        getShape: function (shapeId) {
            return $http({ method: 'get', url: serviceUrl + '/api/BusApi/GetShape?shapeId=' + shapeId });
        },
        getStopTimes: function (stopId, tripId) {
            return $http({ method: 'get', url: serviceUrl + '/api/BusApi/GetStopTimes?stopId=' + stopId + '&tripId=' + tripId });
        }
    };
}]);