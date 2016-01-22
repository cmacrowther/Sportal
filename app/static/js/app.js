
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
    'ui.bootstrap',
    'dashboard.services'
]).
    config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/', {templateUrl: 'home/home.html', controller: 'HomeController'});
        $routeProvider.when('/team_create', {templateUrl: 'team_create/team_create.html', controller: 'team_createController'});
        $routeProvider.when('/team_profile', {templateUrl: 'team_profile/team_profile.html', controller: 'team_profileController'});
        $routeProvider.when('/user_profile', {templateUrl: 'user_profile/user_profile.html', controller: 'user_profileController'});
        $routeProvider.when('/admin', {templateUrl: 'admin/admin.html', controller: 'adminController'});
        $routeProvider.when('/play', {templateUrl: 'play/play.html', controller: 'playController'});
        $routeProvider.otherwise({redirectTo: '/'});
    }]);