
'use strict';

angular.module('example', [
    'ngRoute',
    'example.controllers',
    'ngAnimate',
    'ui.bootstrap'
]).
    config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/', {templateUrl: 'landing/landing.html', controller: 'LandingController'});
        $routeProvider.otherwise({redirectTo: '/'});
    }]);

angular.module('dashboard', [
    'ngRoute',
    'dashboard.controllers',
    'ngAnimate',
    'ui.bootstrap'
]).
    config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/', {templateUrl: 'home/home.html', controller: 'HomeController'});
        $routeProvider.otherwise({redirectTo: '/'});
    }]);