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

    