/**
 * Created by Corey Weber on 2016-01-11.
 */
angular.module('dashboard.controllers',[]).controller('HomeController', ['$scope', '$http','$rootScope', function ($scope, $http, $rootScope) {
    console.log("hello world");

    //Initializes the date time picker plugin.
	$('#birth').datetimepicker({
        format: 'MM/DD/YYYY',
        viewMode: 'years'
    });

    //if id is set in local storage then get user info
    if (localStorage.getItem("id") != null && localStorage.getItem("id") != 0 && $rootScope.userObject == undefined) {

        console.log(localStorage.getItem("id"));
        $scope.userId = localStorage.getItem("id");

        localStorage.setItem("id", 0);

        $http.get("/api/user/" + $scope.userId)
            .success(function (data) {
                $rootScope.userObject = data;

                //Testing by displaying name of logged in user
                $scope.name = $rootScope.userObject.first_name + " " + $rootScope.userObject.last_name;
            })

    }
    //User logged in (don't remember me)
    else if( localStorage.getItem("id") == 0){
        console.log(" Still logged in ");
    }
    else{
        alert(" Not logged in ");
        window.location.assign("/");
    }

}]);
