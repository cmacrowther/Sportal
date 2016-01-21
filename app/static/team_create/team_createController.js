/**
 * Created by Brandon on 1/20/2016.
 */
angular.module('dashboard.controllers').controller('team_createController', ['$scope', '$http', function ($scope, $http) {
	//Initializes the validator plugin
	$('#teamForm').validator();

    console.log("team_create Page");

    //variables
    console.log($scope.team_name);
    console.log($scope.team_password);

    //creates a team in the database
    $scope.createTeam = function() {

    	$http.post("api/team", {
    		sport_id: null,
    		picture: null,
    		adminId: null,
    		name: $scope.team_name,
    		url: null,
    		description: null,
    		password: $scope.team_password

		})
		.success(function() {
			console.log($scope.team_name);
    		console.log($scope.team_password);
			console.log("Team Logged into DB");
			$scope.createTeamResult = "Team Successfully Added!";
		})
    }

}]);