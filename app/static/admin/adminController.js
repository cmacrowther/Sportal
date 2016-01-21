/**
 * Created by Thomas Doucette on 2016-01-21.
 */
angular.module('dashboard.controllers').controller('adminController', ['$scope', '$http', function ($scope, $http) {

	$('#sportForm').validator();
	$('#facilityForm').validator();

    console.log("admin_page");
    //create sport variable
    console.log($scope.sport_name);
    console.log($scope.members_required);
    console.log($scope.teams_required);
    //create facility variables
    console.log($scope.facility_name);
    console.log($scope.facility_address);

    //creation functions
    $scope.createSport = function() {

	    //sending the sport to the database
		$http.post("api/sport", {
    		number_of_members: $scope.members_required,
    		number_of_teams: $scope.teams_required,
    		name: $scope.sport_name,
    		draw_flag: 1
		})
		.success(function(){
			console.log($scope.sport_name);
    		console.log($scope.members_required);
    		console.log($scope.teams_required);
			console.log("Sport Logged into DB");
			$scope.createSportResult = "Sport Successfully Added!";
		})
  		
    }

    $scope.createFacility = function() {
    	
    	//sending the sport to the database
		$http.post("api/facility", {
			name: $scope.facility_name,
			address: $scope.facility_address
		})
		.success(function(){
    		console.log($scope.facility_name);
    		console.log($scope.facility_address);
			console.log("Facility Logged into DB");
			$scope.createFacilityResult = "Facility Successfully Added!";
		})

    }

}]);
