/**
 * Created by Brandon on 1/21/2016.
 */
angular.module('dashboard.controllers').controller('playController', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {

    var passObject = {user_id: $rootScope.userObject.id};

    $rootScope.page_name = "Play";
    $scope.pickSport = "Sport";
    $scope.pickTier = "Difficulty";
    $scope.pickTeams = "Team";


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

    $scope.loadTeams = function () {

        var passObject = {user_id: $rootScope.userObject.id};

        $http({
            method: 'POST',
            url: 'api/get_admin_teams',
            headers: {'Content-Type': 'application/json'},
            data: JSON.stringify(passObject)
        })
        .success(function(data){
            if (data == "no teams") {
                alert("You are not an admin of any teams.  You must be the admin of a team in order to schedule games for your team.");
            }
            else {
                $scope.admin_teams = data;
            }
        })
    }

    //Gets all the sports in the database created by the Admin
    $http.get("/api/sport")
        .success(function (data) {
            console.log(data);
            $scope.sports = data.objects;
        });

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
    $scope.setTeams = function (item) {
        $scope.pickTeams = item;
    };

    //Finds matches similar to games you wish to play
    //No matches will throw you into a queue to wait for a possible match
    $scope.play = function () {
        $scope.playResult = "Searching...";

        if($scope.sport && $scope.pickTier && $scope.pickTeams) {

            $scope.matchObject = {
                user: $rootScope.userObject,
                sport: $scope.sport,
                difficulty: $scope.pickTier,
                team: $scope.pickTeams
            };

            var passObject = {
                user_id: $rootScope.userObject.id,
                sport_id: $scope.sport.id,
                difficulty: $scope.pickTier,
                team: $scope.pickTeams
            };

            console.log("Finding an opponent...");
            console.log(passObject);

            $http({
                method: 'POST',
                url: 'api/single_matchmaking',
                headers: {'Content-Type': 'application/json'},
                data: JSON.stringify(passObject)
            }).success(function (data) {
                console.log(data);
                if (data == "no match") {
                    if ($scope.pickTeams == "1 VS 1") {
                        $scope.is_team = 0;
                    }
                    else {
                        $scope.is_team = 1;
                    }
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
                    $scope.matches_list = data;
                    $('#playModal').modal('show');
                }
            })
        }
        else {
            alert("You must fill out all fields.");
        }
    };

    //Ran when accept challenge button is clicked in the list of possible matches for the user
    //Creates a match object in the database and throws the user to the games page
    $scope.acceptChallenge = function (item) {

        $('#playModal').modal('hide');

        $http.get("api/queue/" + item.queue_id).success(function (data) {
            console.log(data);
            $scope.matches_list.splice(data, 1);

            $http.post("api/send_mail_match", {
                    user: $rootScope.userObject.first_name + " " + $rootScope.userObject.last_name,
                    email: item.email
                })
                .success(function (data) {
                    console.log("Sent email to user.");
                });

            $http.post("api/match", {
                    sport_id: $scope.sport.id,
                    player1_id: $rootScope.userObject.id,
                    player2_id: item.id,
                    is_team: $scope.is_team,
                    date: "",
                    time: "",
                    facility_id: 0,
                    complete: 2,
                    winner_id: 0,
                    score_1: 0,
                    score_2: 0
                })
                .success(function (data) {
                    console.log("Created Match object. Sending opponent email for this request. deleting person from queue");
                    $http.delete("api/queue/" + item.queue_id);

                    window.location.assign("#/games");
                });
        });


        //$http.post("api/get_matches_pending", {
        //        user_id: $rootScope.userObject.id,
        //        page: 1
        //    })
        //    .success(function (data) {
        //        console.log("Finding pending matches.");
        //        $scope.pending_list = data;
        //        //window.location.assign("#/games");
        //    })

    };


}]);