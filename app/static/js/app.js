/**
 * Created by Corey Weber on 2016-01-26.
 */
/**
 * Created by Corey Weber on 2016-01-05.
 */
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