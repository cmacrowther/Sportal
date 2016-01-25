/**
 * Created by Brandon on 1/20/2016.
 */
angular.module('dashboard.controllers').controller('team_createController', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
	//Initializes the validator plugin
	$('#teamForm').validator();

    console.log("team_create Page");

    //variables
    console.log($scope.team_name);
    console.log($scope.team_password);
    console.log($scope.confirm_password);

    //creates a team in the database
    $scope.createTeam = function() {

        var passObject = {url: $scope.team_name};
        $scope.createTeamResult = "";
        $scope.team_name_exists_error = "";

        if ($scope.team_name == null || $scope.team_password == null || $scope.confirm_password == null) {
            console.log("One or more fields empty");
            $scope.team_name_exists_error = "Please Fill in Required Fields.";
        }
        else {
            //Checks if email is taken
            $http({
                method: 'POST',
                url: 'api/team_url_check',
                headers: {'Content-Type': 'application/json'},
                data: JSON.stringify(passObject)
            })
            .success(function(data){
                if (data == "duplicate") {
                    console.log("Team Name Already Exists");
                    $scope.team_name_exists_error = "Team Name Already Exists *";
                }
                else {
                    $http.post("api/team", {
                        sport_id: 0,
                        picture: null,
                        adminId: $rootScope.userObject.id,
                        name: $scope.team_name,
                        url: $scope.team_name,
                        description: null,
                        password: $scope.team_password
                    })
                    .success(function(data) {
                        console.log($scope.team_name);
                        console.log($scope.team_password);
                        console.log("Team Logged into DB");
                        $scope.createTeamResult = "Team Successfully Added!";

                        $http.post("api/user_has_team", {
                            user_id: $rootScope.userObject.id, 
                            team_id: data.id
                        })
                        .success(function(){
                            console.log("Team Added to user profile.");
                        })

                    })
                }
            })
        }
    }

}]);