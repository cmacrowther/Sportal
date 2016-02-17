/**
 * Created by Brandon on 1/21/2016.
 */
angular.module('dashboard.controllers').controller('playController', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {

    console.log("Play Page");


    var passObject = {user_id: $rootScope.userObject.id}
    $http({
        method: 'POST',
        url: 'api/get_user_sports',
        headers: {'Content-Type': 'application/json'},
        data: JSON.stringify(passObject)
    })
        .success(function (data) {
            console.log(data);

            $scope.mySports = data;
        })

    $http.get("/api/sport")
        .success(function (data) {
            console.log(data);
            $scope.sports = data.objects;
        })

    $scope.setSport = function (item) {
        $scope.sport = item;
        $scope.pickSport = $scope.sport.name;
    }

    $scope.setTier = function (item) {
        $scope.pickTier = item;
    }

    $scope.setTeams = function (item) {
        $scope.pickTeams = item;
    }

    $scope.play = function () {
        $scope.playResult = "Searching...";


        $scope.matchObject = {
            user: $rootScope.userObject,
            sport: $scope.sport,
            difficulty: $scope.pickTier,
            team: $scope.pickTeams
        }

        var passObject = {
            user_id: $rootScope.userObject.id,
            sport_id: $scope.sport.id,
            difficulty: $scope.pickTier,
            team: $scope.pickTeams
        }

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
                    difficulty: $scope.pickTier,
                })
                .success(function (data) {
                    console.log("Queued for match");
                    alert("Queued");
                })
            }
            else{
                window.location.assign("#/user_profile/" + data);
            }


        })
    }
}]);