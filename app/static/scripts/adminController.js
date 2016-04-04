/**
 * Created by Brandon Banks, Corey Weber, Colin Crowther, & Thomas Doucette on 2016-01-21.
 *
 * adminController - Includes functions to create a new sport for the Sportal platform users or
 * to create a new facility.
 */

angular.module('dashboard.controllers').controller('adminController', ['$scope', '$timeout', '$http', '$rootScope', function ($scope, $timeout, $http, $rootScope) {

    //Initialize validators for form validation
    $('#sportForm').validator();
    $('#facilityForm').validator();

    $rootScope.page_name = "Admin";

    /* Creates a new sport so that users can be matched with that sport */
    $scope.createSport = function () {
        //resetting result variables
        $scope.createFacilityResult = "";
        $scope.createSportResult = "";

        //sending the sport to the database
        $http.post("api/sport", {
            number_of_members: $scope.members_required,
            number_of_teams: $scope.teams_required,
            name: $scope.sport_name,
            draw_flag: 1
        }).success(function () {
            $scope.createSportResult = "Sport Successfully Added!";
            //resets result variable
            $timeout(function () {
                $scope.createSportResult = "";
            }, 3000);
        })
    };

    /* Creates a new facility and adds it to the sportal platform */
    $scope.createFacility = function () {
        //resetting result variables
        $scope.createFacilityResult = "";
        $scope.createSportResult = "";

        //sending the facility to the database
        $http.post("api/facility", {
            name: $scope.facility_name,
            address: $scope.facility_address
        }).success(function () {
            $scope.createFacilityResult = "Facility Successfully Added!";
            //resets result message
            $timeout(function () {
                $scope.createFacilityResult = "";
            }, 3000);
        })
    };
}]);

