/**
 * Created by Brandon on 1/20/2016.
 */

angular.module('dashboard.controllers').controller('user_profileController', ['$scope', '$rootScope', '$http', function ($scope, $rootScope, $http) {

    //Initializes the form validator plugin.
    $("#user_creation_form").validator();

    //Initializes the date time picker plugin.
    $('#birth').datetimepicker({
        format: 'MM/DD/YYYY',
        viewMode: 'years'
    });

    //variable checks to see if we have values already.
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
    if ($rootScope.userObject.picture == "" || $rootScope.userObject.picture == undefined) {
        $scope.picture = "http://placehold.it/150x150";
    }
    else {
        $scope.picture = $rootScope.userObject.picture;
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

    //Function to toggle between either info displaying or input fields for editing
    $scope.editPage = function () {
        console.log("Edit = true.")
        if ($scope.edit) {
            $scope.edit = false;
        }
        else {
            $scope.edit = true;
        }
    }

    //Function to update info based on inputs with ng-blur
    $scope.updateInfo = function () {
        console.log("Updating Info.");

        $rootScope.userObject.first_name = $scope.first_name;
        $rootScope.userObject.last_name = $scope.last_name;
        $rootScope.userObject.email = $scope.email;
        $rootScope.userObject.picture = $scope.picture;

        $http.put("api/user/" + $rootScope.userObject.id, $rootScope.userObject);
    }

}]);