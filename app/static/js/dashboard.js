$(function () {
    $('#hamburger').click(function () {
        $('.navbar-nav').toggleClass('slide-in');
        $('.side-body').toggleClass('body-slide-in');
        $('#search').removeClass('in').addClass('collapse').slideUp(200);

        /// uncomment code for absolute positioning tweek see top comment in css
        $('.absolute-wrapper').toggleClass('slide-in');

    });
    // Remove menu for searching
    $('#search-trigger').click(function () {
        $('.navbar-nav').removeClass('slide-in');
        $('.side-body').removeClass('body-slide-in');

        /// uncomment code for absolute positioning tweek see top comment in css
        $('.absolute-wrapper').removeClass('slide-in');

    });

    

    //jQuery time
    var parent, ink, d, x, y;
    $("ul li a").click(function(e){
        parent = $(this).parent();
        //create .ink element if it doesn't exist
        if(parent.find(".ink").length == 0)
            parent.prepend("<span class='ink'></span>");
            
        ink = parent.find(".ink");
        //incase of quick double clicks stop the previous animation
        ink.removeClass("animate");
        
        //set size of .ink
        if(!ink.height() && !ink.width())
        {
            //use parent's width or height whichever is larger for the diameter to make a circle which can cover the entire element.
            d = Math.max(parent.outerWidth(), parent.outerHeight());
            ink.css({height: d, width: d});
        }
        
        //get click coordinates
        //logic = click coordinates relative to page - parent's position relative to page - half of self height/width to make it controllable from the center;
        x = e.pageX - parent.offset().left - ink.width()/2;
        y = e.pageY - parent.offset().top - ink.height()/2;
        
        //set the position and add class .animate
        ink.css({top: y+'px', left: x+'px'}).addClass("animate");
    })
});

angular.module('dashboard.controllers')
    .controller('DashboardController', ['$scope', '$http', '$rootScope', '$timeout', function ($scope, $http, $rootScope, $timeout) {

        $rootScope.page_name = "Dashboard";
        $rootScope.message_counter = 0;

        var user_id = localStorage.getItem("id");
        var passObject = {user_id: user_id};

        if (localStorage.getItem("id") != null && localStorage.getItem("id") != 0) {

            console.log(localStorage.getItem("id"));
            $scope.userId = localStorage.getItem("id");

            $http.get("/api/user/" + $scope.userId)
                .success(function (data) {
                    $rootScope.userObject = data;
                    localStorage.setItem("userObject", JSON.stringify($rootScope.userObject));
                    var retrievedObject = JSON.parse(localStorage.getItem("userObject"));
                    console.log(retrievedObject);
                })
        }
        else {
            alert(" Not logged in ");
            window.location.assign("/");
        }

        //getting teams for dashboard list
        $rootScope.teams = [];
        $http({
            method: 'POST',
            url: 'api/get_user_teams',
            headers: {'Content-Type': 'application/json'},
            data: JSON.stringify(passObject)
        })
            .success(function (data) {
                console.log(data);
                if (data == "no teams") {
                    $rootScope.teams = [];
                }
                else {
                    $rootScope.teams = data;
                }
            });

        //getting events for dashboard list
        $rootScope.events = [];
        $http({
            method: 'POST',
            url: 'api/get_user_events',
            headers: {'Content-Type': 'application/json'},
            data: JSON.stringify(passObject)
        })
            .success(function (data) {
                console.log(data);
                if (data == "no events") {
                    $rootScope.events = [];
                }
                else {
                    $rootScope.events = data;
                }
            });

        //grabbing team notifications
        $rootScope.notifications = [];
        $scope.notification_counter = 0;
        $http({
            method: 'POST',
            url: 'api/get_team_notifications',
            headers: {'Content-Type': 'application/json'},
            data: JSON.stringify(passObject)
        })
        .success(function (data) {
            console.log(data);
            if(data == "no team notifications") {
                //nothing
            }
            else {
                for(var i = 0; i < data.length; i++) {
                    $rootScope.notifications.push(data[i]);
                    if(data[i].is_read == 0) {
                        $scope.notification_counter++;
                    }
                }
            }
        });

        //grabbing user notifications
        $http({
            method: 'POST',
            url: 'api/get_user_notifications',
            headers: {'Content-Type': 'application/json'},
            data: JSON.stringify(passObject)
        })
        .success(function (data) {
            console.log(data);
            if(data == "no user notifications") {
                //nothing
            }
            else {
                for(var i = 0; i < data.length; i++) {
                    $rootScope.notifications.push(data[i]);
                    if(data[i].is_read == 0) {
                        $scope.notification_counter++;
                    }
                }
            }
        })

        //INITIAL POPULATION OF MESSAGE COUNTER
        var passObject = {user_id: JSON.parse($scope.userId)};
        console.log(passObject);
        $http({
            method: 'POST',
            url: 'api/get_user_conversations',
            headers: {'Content-Type': 'application/json'},
            data: JSON.stringify(passObject)
        })
        .success(function(data){
            if (data == "no conversations") {
                $rootScope.convos = [];
                $rootScope.no_convos = "No Conversations";
                //$scope.checkNewMessages();
            }
            else {
                $rootScope.convos = data;
                $rootScope.no_convos = "";

                for(var i = 0; i < $rootScope.convos.length; i++) {

                    var passObject = {conversation_id: $rootScope.convos[i].id};
                    $http({
                        method: 'POST',
                        url: 'api/get_conversation_messages',
                        headers: {'Content-Type': 'application/json'},
                        data: JSON.stringify(passObject)
                    })
                    .success(function(data){

                        if(data == "no messages") {
                            //nothing new
                        }
                        else {
                            for(var i = 0; i < data.length; i++) {
                                if(data[i].is_read_user_two == 0 && data[i].user_id != $rootScope.userObject.id) {
                                    $rootScope.message_counter++;
                                }
                            }
                        }
                    })
                }
            }

        })
        //POPULATION ENDS HERE


        //Initialization of pusher used to update message counter
        Pusher.log = function(message) {
            if (window.console && window.console.log) {
                window.console.log(message);
            }
        };

        var pusher = new Pusher('56753b214ab2420a7230', {
          encrypted: true
        });

        var channel = pusher.subscribe('unchained');
        channel.bind('new_message', function(data) {
            if(data.message == "increase_count" && data.to == $rootScope.userObject.id) {
                if($rootScope.convo_id == data.convo_id) {
                    //dont increase the counter
                }
                else {
                    $rootScope.message_counter+=1;
                    $http.get("api/user/" + data.to)
                    .success(function(data){
                        alert("Increasing counter for " + data.first_name);
                    })
                }
            }
        });

        //Logout
        $scope.logout = function () {

            localStorage.setItem("id", 0);

            window.location.assign("/");
        };

        $scope.is_read_set = function (item) {

            if (item.is_read == 1) {
                //already read, do nothing
                console.log("Notification already read.");
            }
            else {
                item.is_read = 1;
                if (item.team_id) {
                    $http.put("/api/team_has_notification/" + item.id, item);
                }
                else {
                    $http.put("/api/user_has_notification/" + item.id, item);
                }
                console.log("Notification Read.");

                //decrease the counter
                if ($scope.notification_counter > 0) {
                    $scope.notification_counter-=1;
                }
            }

        }


        // END OF MODULE ----------------------------------------------------------------------------------------
    }]);

    angular.module('dashboard').directive('isActiveNav', [ '$location', function($location) {
        return {
            restrict: 'A',
            link: function(scope, element) {
            scope.location = $location;
            scope.$watch('location.path()', function(currentPath) {
                if('#' + currentPath === element[0].attributes['href'].nodeValue) {
                    //element.parent().addClass('active');
                    setTimeout(function(){
                        element.parent().addClass('active');
                    }, 500);
                    console.log("Checks out!");
                } else {
                    element.parent().removeClass('active');
                }
            });
        }
    };
}]);