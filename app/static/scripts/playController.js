/**
 * Created by Brandon on 1/21/2016.
 */
angular.module('dashboard.controllers').controller('playController', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {

    //Declaring Variables
    $rootScope.page_name = "Play";
    $scope.pickSport = "Sport";
    $scope.pickTier = "Difficulty";
    $scope.pickTeams = "Team";
    var passObject = {user_id: $rootScope.userObject.id};

    //Gets the sports the user has set in there profile as "favourites"
    $http({
        method: 'POST',
        url: 'api/get_user_sports',
        headers: {'Content-Type': 'application/json'},
        data: JSON.stringify(passObject)
    })
    .success(function (data) {
        console.log(data);

        $scope.mySports = data;
    });

    //Gets all the sports in the database created by the Admin
    $http.get("/api/sport")
    .success(function (data) {
        console.log(data);
        $scope.sports = data.objects;
    });

    //loads teams for the option of playing with a team you direct
    $scope.loadTeams = function () {

        var passObject = {user_id: $rootScope.userObject.id};

        $http({
            method: 'POST',
            url: 'api/get_admin_teams',
            headers: {'Content-Type': 'application/json'},
            data: JSON.stringify(passObject)
        })
            .success(function (data) {
                if (data == "no teams") {
                    alert("You are not an admin of any teams.  You must be the admin of a team in order to schedule games for your team.");
                }
                else {
                    $scope.admin_teams = data;
                }
            })
    }

    //Sets the sport the user wishes to find opponents for
    $scope.setSport = function (item) {
        $scope.sport = item;
        $scope.pickSport = $scope.sport.name;
    };

    //Sets the tier Novice, Intermediate, etc
    $scope.setTier = function (item) {
        $scope.pickTier = item;
    };

    //Sets 1vs1, 2vs2, 3vs3, etc
    $scope.setSingles = function (item) {
        $scope.pickTeams = "1 VS 1";
        $scope.is_team = 0;
    };
    $scope.setTeamObject = function (item) {
        $scope.pickTeamObject = item;
        $scope.is_team = 1;
        $scope.pickTeams = item.name;
    };
    
    //Finds matches similar to games you wish to play
    //No matches? will throw you into a queue to wait for a possible match
    $scope.play = function () {
        $scope.playResult = "Searching...";

        if ($scope.sport && $scope.pickTier && $scope.pickTeams) {

            if ($scope.is_team) {

                var passObject = {
                    user_id: $scope.pickTeamObject.id,
                    sport_id: $scope.sport.id,
                    difficulty: $scope.pickTier,
                    team: $scope.pickTeams
                }
            }
            else {

                var passObject = {
                    user_id: $rootScope.userObject.id,
                    sport_id: $scope.sport.id,
                    difficulty: $scope.pickTier,
                    team: $scope.pickTeams
                };
            }


            console.log("Finding an opponent...");
            console.log(passObject);

            $http({
                method: 'POST',
                url: 'api/matchmaking',
                headers: {'Content-Type': 'application/json'},
                data: JSON.stringify(passObject)
            }).success(function (data) {
                console.log(data);
                if (data == "no match") {
                    if ($scope.pickTeams == "1 VS 1") {
                        $scope.is_team = 0;

                        $http.post("api/queue", {
                            sport_id: $scope.sport.id,
                            user_id: $rootScope.userObject.id,
                            is_team: $scope.is_team,
                            members: $scope.pickTeams,
                            difficulty: $scope.pickTier
                        })
                        .success(function (data) {
                            console.log("Queued for match");
                            alert("No Current Matches, you have been queued.");
                        })
                    }
                    else {
                        $scope.is_team = 1;

                         $http.post("api/queue", {
                            sport_id: $scope.sport.id,
                            user_id: $scope.pickTeamObject.id,
                            is_team: $scope.is_team,
                            members: $scope.pickTeams,
                            difficulty: $scope.pickTier
                        })
                        .success(function (data) {
                            console.log("Queued for match");
                            alert("No Current Matches, your team has been queued.");
                        })
                    }
                }
                else {
                    $scope.matches_list = data;
                    $('#playModal').modal('show');
                }
            })
        }
        else {
            alert("You must fill out all fields.");
        }
    }
    ;

    //Ran when accept challenge button is clicked in the list of possible matches for the user
    //Creates a match object in the database and throws the user to the games page
    $scope.acceptChallenge = function (item) {

        $('#playModal').modal('hide');

        $http.get("api/queue/" + item.queue_id)
        .success(function (data) {
            console.log(data);
            $scope.matches_list.splice(data, 1);

            $http.post("api/send_mail_match", {
                    user: $rootScope.userObject.first_name + " " + $rootScope.userObject.last_name,
                    email: item.email
                })
                .success(function (data) {
                    console.log("Sent email to user.");
                });

            if($scope.is_team) {
                $scope.setPlayer1 = $scope.pickTeamObject.id;
            }
            else {
                $scope.setPlayer1 = $rootScope.userObject.id;
            }

            $http.post("api/match", {
                    sport_id: $scope.sport.id,
                    player1_id: $scope.setPlayer1,
                    player2_id: item.id,
                    is_team: $scope.is_team,
                    date: new Date(),
                    time: new Date(),
                    facility_id: 0,
                    complete: 2,
                    winner_id: 0,
                    score_1: 0,
                    score_2: 0
                })
                .success(function (data) {
                    console.log("Created Match object. Sending opponent email for this request. deleting person from queue");
                    $http.delete("api/queue/" + item.queue_id);

                    if ($scope.is_team) {
                        $http.post("api/team_has_notification", {
                            team_id: data.player2_id,
                            notification: $scope.pickTeamObject.name + " has challenged your team.",
                            time: new Date(),
                            link: "#/games",
                            is_read: 0
                        })
                        .success(function(){
                            console.log("Team Notification Sent");
                        })
                    }
                    else {
                        $http.post("api/user_has_notification", {
                            user_id: data.player2_id,
                            notification: $rootScope.userObject.first_name + " " + $rootScope.userObject.last_name + " has challenged you.",
                            time: new Date(),
                            link: "#/games",
                            is_read: 0
                        })
                        .success(function(){
                            console.log("USer Notification Sent");
                        })
                    }

                    window.location.assign("#/games");
                });
        });
    };


}]);