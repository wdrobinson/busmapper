'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'angular-loading-bar',
  'ngRoute',
  'myApp.busMapper',
  'myApp.mapControls'
]).
config(['$routeProvider', 'cfpLoadingBarProvider', function($routeProvider, cfpLoadingBarProvider) {
  $routeProvider.otherwise({redirectTo: '/Louisville'});
  cfpLoadingBarProvider.includeSpinner = false;
}]);