/**
 * Created by Brandon on 1/20/2016.
 */

angular.module('dashboard.controllers').controller('user_profileController', ['$scope', '$rootScope', '$http', function ($scope, $rootScope, $http) {


    $("#user_creation_form").validator();

    //Initializes the date time picker plugin.
    $('#birth').datetimepicker({
        format: 'MM/DD/YYYY',
        viewMode: 'years'
    });


    if ($rootScope.userObject.first_name == "" || $rootScope.userObject.first_name == undefined) {
        $scope.first_name = "No info given";
    }
    else {
        $scope.first_name = $rootScope.userObject.first_name;
    }

    if ($rootScope.userObject.last_name == "" || $rootScope.userObject.last_name == undefined) {
        $scope.last_name = "No info given";
    }
    else {
        $scope.last_name = $rootScope.userObject.last_name;
    }

    if ($rootScope.userObject.email == "" || $rootScope.userObject.email == undefined) {
        $scope.email = "No info given";
    }
    else {
        $scope.email = $rootScope.userObject.email;
    }
    if ($rootScope.userObject.birth == "" || $rootScope.userObject.birth == undefined) {
        $scope.birth = "No info given";
    }
    else {
        $scope.birth = $rootScope.userObject.birth;
    }
    if ($rootScope.userObject.address == "" || $rootScope.userObject.address == undefined) {
        $scope.address = "No info given";
    }
    else {
        $scope.address = $rootScope.userObject.address;
    }
    if ($rootScope.userObject.address2 == "" || $rootScope.userObject.address2 == undefined) {
        $scope.address2 = "No info given";
    }
    else {
        $scope.address2 = $rootScope.userObject.address2;
    }
    if ($rootScope.userObject.city == "" || $rootScope.userObject.city == undefined) {
        $scope.city = "No info given";
    }
    else {
        $scope.city = $rootScope.userObject.city;
    }
    if ($rootScope.userObject.postal_code == "" || $rootScope.userObject.postal_code == undefined) {
        $scope.postal_code = "No info given";
    }
    else {
        $scope.postal_code = $rootScope.userObject.postal_code;
    }
    if ($rootScope.userObject.province == "" || $rootScope.userObject.province == undefined) {
        $scope.province = "No info given";
    }
    else {
        $scope.province = $rootScope.userObject.province;
    }
    if ($rootScope.userObject.country == "" || $rootScope.userObject.country == undefined) {
        $scope.country = "No info given";
    }
    else {
        $scope.country = $rootScope.userObject.country;
    }
    if ($rootScope.userObject.gender == "" || $rootScope.userObject.gender == undefined) {
        $scope.gender = "No info given";
    }
    else {
        $scope.gender = $rootScope.userObject.gender;
    }
    if ($rootScope.userObject.interests == "" || $rootScope.userObject.interests == undefined) {
        $scope.interests = "No info given";
    }
    else {
        $scope.interests = $rootScope.userObject.interests;
    }
    if ($rootScope.userObject.password == "" || $rootScope.userObject.password == undefined) {
        $scope.password = "No info given";
    }
    else {
        $scope.password = "Password is set.";
    }


    $scope.editPage = function () {
        console.log("Edit = true.")
        if ($scope.edit) {
            $scope.edit = false;
        }
        else {
            $scope.edit = true;
        }
    }

    $scope.updateInfo = function () {
        console.log("Updating Info.");

    }

}]);