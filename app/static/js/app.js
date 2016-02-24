
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
        $routeProvider.when('/search', {templateUrl: 'search/search.html', controller: 'searchController'});
        $routeProvider.when('/team_create', {templateUrl: 'team_create/team_create.html', controller: 'team_createController'});
        $routeProvider.when('/join_team', {templateUrl: 'join_team/join_team.html', controller: 'join_teamController'});
        $routeProvider.when('/user_profile/:user_id', {templateUrl: 'user_profile/user_profile.html', controller: 'user_profileController'});
        $routeProvider.when('/error/:error', {templateUrl: 'error/error.html', controller: 'errorController'});
        $routeProvider.when('/team_profile/:url', {templateUrl: 'team_profile/team_profile.html', controller: 'team_profileController'});
        $routeProvider.when('/games', {templateUrl: 'games/games.html', controller: 'gamesController'});
        $routeProvider.when('/event_create', {templateUrl: 'event_create/event_create.html', controller: 'event_createController'});
        $routeProvider.when('/events/:url', {templateUrl: 'events/events.html', controller: 'eventsController'});
        $routeProvider.when('/admin', {templateUrl: 'admin/admin.html', controller: 'adminController'});
        $routeProvider.when('/play', {templateUrl: 'play/play.html', controller: 'playController'});
        $routeProvider.when('/messages', {templateUrl: 'channels/channel.html', controller: 'channelController'});
        $routeProvider.otherwise({redirectTo: '/'});
    }]);