/**
 * Created by Thomas Doucette on 2016-01-21.
 */
angular.module('dashboard.controllers').controller('adminController', ['$scope', '$timeout', '$http', '$rootScope', function ($scope, $timeout, $http, $rootScope) {

    //Initialize validators
    $('#sportForm').validator();
    $('#facilityForm').validator();

    $rootScope.page_name = "Admin";

    //create a new sport
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
            })
            .success(function () {
                console.log($scope.sport_name);
                console.log($scope.members_required);
                console.log($scope.teams_required);
                console.log("Sport Logged into DB");
                $scope.createSportResult = "Sport Successfully Added!";
                $timeout(function () {
                    $scope.createSportResult = "";
                }, 3000);
            })
    };

    //Create a new facility
    $scope.createFacility = function () {
        //sending the facility to the database
        $http.post("api/facility", {
                name: $scope.facility_name,
                address: $scope.facility_address
            })
            .success(function () {
                console.log($scope.facility_name);
                console.log($scope.facility_address);
                console.log("Facility Logged into DB");
                $scope.createFacilityResult = "Facility Successfully Added!";
                $timeout(function () {
                    $scope.createFacilityResult = "";
                }, 3000);
            })
    };
}]);

