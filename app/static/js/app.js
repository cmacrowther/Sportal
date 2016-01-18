
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