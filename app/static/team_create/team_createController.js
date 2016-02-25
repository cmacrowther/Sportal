/**
 * Created by Brandon on 1/20/2016.
 */
angular.module('dashboard.controllers').controller('team_createController', ['$scope', '$http', '$timeout', '$rootScope', function ($scope, $http, $timeout, $rootScope) {

    //Initializes the validator plugin
    $('#teamForm').validator();

    console.log("team_create Page");

    $rootScope.page_name = "Create Team";

    //creates a team in the database
    $scope.createTeam = function () {
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
                .success(function (data) {
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
                            .success(function (data) {
                                console.log($scope.team_name);
                                console.log($scope.team_password);
                                console.log("Team Logged into DB");
                                $scope.createTeamResult = "Team Successfully Added!";
                                $timeout(function () {
                                    $scope.createTeamResult = "";
                                }, 3000);
                                $rootScope.teams.push(data);
                                $scope.team_id_ = data.id;

                                $http.post("api/user_has_team", {
                                        user_id: $rootScope.userObject.id,
                                        team_id: data.id
                                    })
                                    .success(function () {
                                        console.log("User_has_team Updated");
                                    });

                                $http.post("api/team_has_admin", {
                                        user_id: $rootScope.userObject.id,
                                        team_id: data.id
                                    })
                                    .success(function () {
                                        console.log("Team_has_admin Updated");

                                        $http.post("api/channel", {
                                                admin_id: $rootScope.userObject.id,
                                                name: $scope.team_name,
                                                description: "description"
                                            })
                                            .success(function (data) {
                                                console.log("Successful Create.");
                                                $http.post("api/team_has_channel", {
                                                    team_id: $scope.team_id_,
                                                    channel_id: data.id
                                                })
                                                .success(function(data){
                                                    console.log("successful channel creation");
                                                })
                                            })
                                    })
                            })
                    }
                })
        }
    };
}]);