/**
 * Created by Brandon on 1/21/2016.
 */
angular.module('dashboard.controllers').controller('playController', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {

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
                        alert("Queued");
                    })
            }
            else {
                $scope.matches_list = data;
            }
        })
    };

    //Ran when accept challenge button is clicked in the list of possible matches for the user
    //Creates a match object in the database and throws the user to the games page
    $scope.acceptChallenge = function (item) {
        console.log("You accepted the challenge of user with id: " + item);
        $http.post("api/match", {
                sport_id: $scope.sport.id,
                player1_id: $rootScope.userObject.id,
                player2_id: item,
                is_team: $scope.is_team,
                date: "",
                time: "",
                facility_id: 0,
                complete: 0,
                winner_id: 0,
                score_1: 0,
                score_2: 0
            })
            .success(function (data) {
                console.log("Created Match object.");
                window.location.assign("#/games");
            })
    };

    
}]);