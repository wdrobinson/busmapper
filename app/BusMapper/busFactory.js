angular.module('myApp').factory('busFactory', ['$http', function ($http) {
    var serviceUrl = 'http://pollerbear-001-site2.ctempurl.com';
    return {
        getBusPositions: function () {
            return $http({ method: 'get', url: serviceUrl + '/Bus/GetBusPositions' });
        },
        getTrips: function () {
            return $http({ method: 'get', url: serviceUrl + '/Bus/GetTrips' });
        },
        getTripStops: function (tripId) {
            return $http({ method: 'get', url: serviceUrl + '/Bus/GetTripStops?tripId=' + tripId });
        },
        getShapeGeoJson: function (shapeId) {
            return $http({ method: 'get', url: serviceUrl + '/Bus/GetShapeGeoJson?shapeId=' + shapeId });
        },
        getShape: function (shapeId) {
            return $http({ method: 'get', url: serviceUrl + '/Bus/GetShape?shapeId=' + shapeId });
        },
        getStopTimes: function (stopId, tripId) {
            return $http({ method: 'get', url: serviceUrl + '/Bus/GetStopTimes?stopId=' + stopId + '&tripId=' + tripId });
        }
    };
}]);