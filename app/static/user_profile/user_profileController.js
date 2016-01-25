/**
 * Created by Brandon on 1/20/2016.
 */

angular.module('dashboard.controllers').controller('user_profileController', ['$scope', '$rootScope', '$http', function ($scope, $rootScope, $http) {

    console.log("user_profil Page");

    $("#user_creation_form").validator();

    //Initializes the date time picker plugin.
    $('#birth').datetimepicker({
        format: 'MM/DD/YYYY',
        viewMode: 'years'
    });

    if ($rootScope.userObject.first_name == "" || $rootScope.userObject.first_name == undefined) {
        $scope.first_name_value = true;
    }
    else {
        $scope.first_name_value = false;
        $scope.first_name = $rootScope.userObject.first_name;
    }
    if ($rootScope.userObject.last_name == "" || $rootScope.userObject.last_name == undefined) {
        $scope.last_name_value = true;
    }
    else {
        $scope.last_name_value = false;
        $scope.last_name = $rootScope.userObject.last_name;
    }
    if ($rootScope.userObject.email == "" || $rootScope.userObject.email == undefined) {
        $scope.email_value = true;
    }
    else {
        $scope.email_value = false;
        $scope.email = $rootScope.userObject.email;
    }


    $scope.edit_first_name = function(){
        $scope.first_name_value = true;
    }


}]);