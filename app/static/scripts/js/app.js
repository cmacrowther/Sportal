
'use strict';

angular.module('example', [
    'ngRoute',
    'example.controllers',
    'ngAnimate',
    'ui.bootstrap',
    'angular-loading-bar'
]).config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/', {templateUrl: '../views/pages/landing.html', controller: 'LandingController'});
        $routeProvider.otherwise({redirectTo: '/'});
    }]);

angular.module('dashboard', [
    'ngRoute',
    'dashboard.controllers',
    'ngAnimate',
    'ui.bootstrap',
    'dashboard.services',
    'angular-loading-bar',
    'luegg.directives'
])
.config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/', {templateUrl: '../../views/pages/home.html', controller: 'HomeController'});
        $routeProvider.when('/search', {templateUrl: '../views/pages/search.html', controller: 'searchController'});
        $routeProvider.when('/team_create', {templateUrl: '../views/pages/team_create.html', controller: 'team_createController'});
        $routeProvider.when('/join_team', {templateUrl: '../views/pages/join_team.html', controller: 'join_teamController'});
        $routeProvider.when('/user_profile/:user_id', {templateUrl: '../views/pages/user_profile.html', controller: 'user_profileController'});
        $routeProvider.when('/error/:error', {templateUrl: '../views/pages/error.html', controller: 'errorController'});
        $routeProvider.when('/team_profile/:url', {templateUrl: '../views/pages/team_profile.html', controller: 'team_profileController'});
        $routeProvider.when('/games', {templateUrl: '../views/pages/games.html', controller: 'gamesController'});
        $routeProvider.when('/event_create', {templateUrl: '../views/pages/event_create.html', controller: 'event_createController'});
        $routeProvider.when('/events/:url', {templateUrl: '../views/pages/events.html', controller: 'eventsController'});
        $routeProvider.when('/admin', {templateUrl: '../views/pages/admin.html', controller: 'adminController'});
        $routeProvider.when('/play', {templateUrl: '../views/pages/play.html', controller: 'playController'});
        $routeProvider.when('/messages', {templateUrl: '../views/pages/channel.html', controller: 'channelController'});
        $routeProvider.when('/messages/user/:user_id', {templateUrl: '../views/pages/channel.html', controller: 'channelController'});
        $routeProvider.when('/messages/team/:team1_id/:team2_id', {templateUrl: '../views/pages/channel.html', controller: 'channelController'});
        $routeProvider.when('/pusher_test', {templateUrl: '../views/pages/pusher_test.html', controller: 'pusherTestController'});
        $routeProvider.otherwise({redirectTo: '/'});
    }]);






