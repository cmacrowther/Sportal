$(function () {
    $('.navbar-toggle').click(function () {
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
    .controller('DashboardController', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {

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
    }]);

    