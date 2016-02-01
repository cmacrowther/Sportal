/**
 * Created by Brandon on 1/20/2016.
 */
angular.module('dashboard.controllers').controller('team_createController', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
	//Initializes the validator plugin
	$('#teamForm').validator();

    $scope.Fruits = [{
        Id: 1,
        Name: 'Apple'
    }, {
        Id: 2,
        Name: 'Mango'
    }, {
        Id: 3,
        Name: 'Orange'
    }];

    $scope.GetValue = function (fruit) {
        var fruitId = $scope.ddlFruits;
        var fruitName = $.grep($scope.Fruits, function (fruit) {
            return fruit.Id == fruitId;
        })[0].Name;
        alert("Selected Value: " + fruitId + "\nSelected Text: " + fruitName);
    }

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
            //Checks if url is taken
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
                        $rootScope.teams.push(data);

                        $http.post("api/user_has_team", {
                            user_id: $rootScope.userObject.id,
                            team_id: data.id
                        })
                        .success(function(){
                            console.log("User_has_team Updated");
                        })

                    })
                }
            })
        }
    }

}]);