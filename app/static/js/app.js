'use strict';

angular.module('example', [
    'ngRoute',
    'example.controllers',
    'ngAnimate',
    'ui.bootstrap'
]).
config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/', {templateUrl: 'landing/landing.html', controller: 'LandingController'});
    $routeProvider.otherwise({redirectTo: '/'});
}]);

angular.module('dashboard', [
    'ngRoute',
    'dashboard.controllers',
    'ngAnimate',
    'ui.bootstrap',
    'dashboard.services',
    'firebase',
    'angular-md5',
    'ui.router'
]).
    config(['$routeProvider','$stateProvider','$urlRouterProvider', function ($routeProvider, $stateProvider, $urlRouterProvider) {
        $routeProvider.when('/', {templateUrl: 'home/home.html', controller: 'HomeController'});
        $routeProvider.when('/search', {templateUrl: 'search/search.html', controller: 'searchController'});
        $routeProvider.when('/team_create', {
            templateUrl: 'team_create/team_create.html',
            controller: 'team_createController'
        });
        $routeProvider.when('/join_team', {templateUrl: 'join_team/join_team.html', controller: 'join_teamController'});
        $routeProvider.when('/user_profile/:user_id', {
            templateUrl: 'user_profile/user_profile.html',
            controller: 'user_profileController'
        });
        $routeProvider.when('/error/:error', {templateUrl: 'error/error.html', controller: 'errorController'});
        $routeProvider.when('/team_profile/:url', {
            templateUrl: 'team_profile/team_profile.html',
            controller: 'team_profileController'
        });
        $routeProvider.when('/games', {templateUrl: 'games/games.html', controller: 'gamesController'});
        $routeProvider.when('/event_create', {
            templateUrl: 'event_create/event_create.html',
            controller: 'event_createController'
        });
        $routeProvider.when('/events/:url', {templateUrl: 'events/events.html', controller: 'eventsController'});
        $routeProvider.when('/admin', {templateUrl: 'admin/admin.html', controller: 'adminController'});
        $routeProvider.when('/play', {templateUrl: 'play/play.html', controller: 'playController'});

        $routeProvider.when('/test_messages', {templateUrl: 'test_messages/index.html', controller: 'ChannelsController'});
        $stateProvider
            .state('home', {
                url: '/messages',
                templateUrl: 'message_home/home.html',
                resolve: {
                    requireNoAuth: function ($state, Auth) {
                        return Auth.$requireAuth().then(function (auth) {
                            $state.go('channels');
                        }, function (error) {
                            return;
                        });
                    }
                }
            })
            .state('login', {
                url: '/login',
                controller: 'AuthCtrl as authCtrl',
                templateUrl: 'auth/login.html',
                resolve: {
                    requiredNoAuth: function ($state, Auth) {
                        return Auth.$requireAuth().then(function (auth) {
                            $state.go('home');
                        }, function (error) {
                            return;
                        })
                    }
                }

            })
            .state('register', {
                url: '/register',
                controller: 'AuthCtrl as authCtrl',
                templateUrl: 'auth/register.html',
                resolve: {
                    requiredNoAuth: function ($state, Auth) {
                        return Auth.$requireAuth().then(function (auth) {
                            $state.go('home');
                        }, function (error) {
                            return;
                        })
                    }
                }
            })
            .state('channels', {
                url: '/channels',
                controller: 'ChannelsCtrl as channelsCtrl',
                templateUrl: 'channels/index.html',
                resolve: {
                    channels: function (Channels) {
                        return Channels.$loaded();
                    },
                    profile: function ($state, Auth, Users) {
                        return Auth.$requireAuth().then(function (auth) {
                            return Users.getProfile(auth.uid).$loaded().then(function (profile) {
                                if (profile.displayName) {
                                    return profile;
                                } else {
                                    $state.go('profile');
                                }
                            });
                        }, function (error) {
                            $state.go('home');
                        });
                    }
                }
            })

            .state('channels.messages', {
                url: '/{channelId}/messages',
                templateUrl: 'channels/messages.html',
                controller: 'MessagesCtrl as messagesCtrl',
                resolve: {
                    messages: function ($stateParams, Messages) {
                        return Messages.forChannel($stateParams.channelId).$loaded();
                    },
                    channelName: function ($stateParams, channels) {
                        return '#' + channels.$getRecord($stateParams.channelId).name;
                    }
                }
            })

            .state('channels.direct', {
                url: '/{uid}/messages/direct',
                templateUrl: 'channels/messages.html',
                controller: 'MessagesCtrl as messagesCtrl',
                resolve: {
                    messages: function ($stateParams, Messages, profile) {
                        return Messages.forUsers($stateParams.uid, profile.$id).$loaded();
                    },
                    channelName: function ($stateParams, Users) {
                        return Users.all.$loaded().then(function () {
                            return '@' + Users.getDisplayName($stateParams.uid);
                        });
                    }
                }
            })

            .state('channels.create', {
                url: '/createChan',
                controller: 'ChannelsCtrl as channelsCtrl',
                templateUrl: 'channels/create.html'
            })
            .state('profile', {
                url: '/profile',
                controller: 'ProfileCtrl as profileCtrl',
                templateUrl: 'users/profile.html',
                resolve: {
                    auth: function ($state, Users, Auth) {
                        return Auth.$requireAuth().catch(function () {
                            $state.go('home');
                        });
                    },

                    profile: function (Users, Auth) {
                        return Auth.$requireAuth().then(function (auth) {
                            return Users.getProfile(auth.uid).$loaded();
                        });
                    }
                }
            })

        $routeProvider.otherwise('/');
    }])
    .constant('FirebaseUrl', 'https://burning-fire-322.firebaseio.com/');


/*
//Messaging
angular
    .module('angularfireSlackApp', [
        'firebase',
        'angular-md5',
        'ui.router'
    ])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'message_home/home.html',
                resolve: {
                    requireNoAuth: function ($state, Auth) {
                        return Auth.$requireAuth().then(function (auth) {
                            $state.go('channels');
                        }, function (error) {
                            return;
                        });
                    }
                }
            })
            .state('login', {
                url: '/login',
                controller: 'AuthCtrl as authCtrl',
                templateUrl: 'auth/login.html',
                resolve: {
                    requiredNoAuth: function ($state, Auth) {
                        return Auth.$requireAuth().then(function (auth) {
                            $state.go('home');
                        }, function (error) {
                            return;
                        })
                    }
                }

            })
            .state('register', {
                url: '/register',
                controller: 'AuthCtrl as authCtrl',
                templateUrl: 'auth/register.html',
                resolve: {
                    requiredNoAuth: function ($state, Auth) {
                        return Auth.$requireAuth().then(function (auth) {
                            $state.go('home');
                        }, function (error) {
                            return;
                        })
                    }
                }
            })
            .state('channels', {
                url: '/channels',
                controller: 'ChannelsCtrl as channelsCtrl',
                templateUrl: 'channels/index.html',
                resolve: {
                    channels: function (Channels) {
                        return Channels.$loaded();
                    },
                    profile: function ($state, Auth, Users) {
                        return Auth.$requireAuth().then(function (auth) {
                            return Users.getProfile(auth.uid).$loaded().then(function (profile) {
                                if (profile.displayName) {
                                    return profile;
                                } else {
                                    $state.go('profile');
                                }
                            });
                        }, function (error) {
                            $state.go('home');
                        });
                    }
                }
            })

            .state('channels.messages', {
                url: '/{channelId}/messages',
                templateUrl: 'channels/messages.html',
                controller: 'MessagesCtrl as messagesCtrl',
                resolve: {
                    messages: function ($stateParams, Messages) {
                        return Messages.forChannel($stateParams.channelId).$loaded();
                    },
                    channelName: function ($stateParams, channels) {
                        return '#' + channels.$getRecord($stateParams.channelId).name;
                    }
                }
            })

            .state('channels.direct', {
                url: '/{uid}/messages/direct',
                templateUrl: 'channels/messages.html',
                controller: 'MessagesCtrl as messagesCtrl',
                resolve: {
                    messages: function ($stateParams, Messages, profile) {
                        return Messages.forUsers($stateParams.uid, profile.$id).$loaded();
                    },
                    channelName: function ($stateParams, Users) {
                        return Users.all.$loaded().then(function () {
                            return '@' + Users.getDisplayName($stateParams.uid);
                        });
                    }
                }
            })

            .state('channels.create', {
                url: '/createChan',
                controller: 'ChannelsCtrl as channelsCtrl',
                templateUrl: 'channels/create.html'
            })
            .state('profile', {
                url: '/profile',
                controller: 'ProfileCtrl as profileCtrl',
                templateUrl: 'users/profile.html',
                resolve: {
                    auth: function ($state, Users, Auth) {
                        return Auth.$requireAuth().catch(function () {
                            $state.go('home');
                        });
                    },

                    profile: function (Users, Auth) {
                        return Auth.$requireAuth().then(function (auth) {
                            return Users.getProfile(auth.uid).$loaded();
                        });
                    }
                }
            })

        $urlRouterProvider.otherwise('/');
    })
    .constant('FirebaseUrl', 'https://burning-fire-322.firebaseio.com/');
*/
