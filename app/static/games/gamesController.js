/**
 * Created by Brandon on 1/20/2016.
 */
angular.module('dashboard.controllers').controller('gamesController', ['$scope', '$http', '$rootScope', '$routeParams', function ($scope, $http, $rootScope, $routeParams) {

    var passObject = {user_id: $rootScope.userObject.id, page: 3};

    $scope.games_pending = [];
    $scope.gamesip = [];
    $scope.past_games = [];
    $scope.no_games_ip = "No Games in Progress";
    $scope.no_past_games = "No Past Games";


    //code here
    $http({
        method: 'POST',
        url: 'api/get_user_games',
        headers: {'Content-Type': 'application/json'},
        data: JSON.stringify(passObject)
    })
        .success(function (data) {
            console.log(data);
            if (data == "no match") {
                //do nothing
            }
            else {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].complete == 2) {
                        console.log("Challenge is presentttttttttttttttttttt");
                        $scope.games_pending.push(data[i]);
                    }
                    else if (data[i].complete == 1) {
                        $scope.past_games.push(data[i]);
                        if (data[i].winner_id == $rootScope.userObject.id) {
                            if (data[i].score_1 > data[i].score_2) {
                                data[i].results = "WIN " + data[i].score_1 + "-" + data[i].score_2;
                            }
                            else {
                                data[i].results = "WIN " + data[i].score_2 + "-" + data[i].score_1;
                            }
                        }
                        else {
                            if (data[i].score_1 > data[i].score_2) {
                                data[i].results = "LOSS " + data[i].score_1 + "-" + data[i].score_2;
                            }
                            else {
                                data[i].results = "LOSS " + data[i].score_2 + "-" + data[i].score_1;
                            }
                        }
                        $scope.no_past_games = "";
                    }
                    else {
                        $scope.gamesip.push(data[i]);
                        $scope.no_games_ip = "";
                    }
                }
            }

        });

    //$http.post("api/get_matches_pending", {
    //        user_id: $rootScope.userObject.id,
    //        page: 0
    //    })
    //    .success(function (data) {
    //        console.log("Finding pending matches.");
    //        $scope.games_pending = data;
    //        console.log(data);
    //        //window.location.assign("#/games");
    //    });

    $scope.getSport = function (item) {

        $http.get("/api/sport/" + item.sport_id)
            .success(function (data) {
                item.sport_name = data.name;
            })

    };

    $scope.getUser = function (item) {

        $http.get("/api/user/" + item.player2_id)
            .success(function (data) {
                item.opponent = data.first_name + " " + data.last_name;
            })
    };

    $scope.setModal = function (item) {
        $scope.modalObject = item;
    };

    $http.get("/api/sport")
        .success(function (data) {
            console.log(data);
            $scope.allSports = data.objects;
        });

    $http.get("/api/facility")
        .success(function (data) {
            console.log(data);
            $scope.allFacilities = data.objects;
        });

    $scope.updateInfo = function () {

        console.log("Updating Info.");

        $http.get("api/match/" + $scope.modalObject.id)
            .success(function (data) {

                data.facility_id = $scope.facility;
                data.date = $scope.modalObject.date;
                data.time = $scope.modalObject.time;

                $http.put("api/match/" + data.id, data);
            })
    };

    $scope.getWinner = function () {
        if ($scope.your_score > $scope.opponent_score) {
            $scope.game_results = "You Won! :)";
            $scope.modalObject.winner_id = $rootScope.userObject.id;
        }
        else if ($scope.your_score < $scope.opponent_score) {
            $scope.game_results = "You Lost! :(";
            $scope.modalObject.winner_id = $scope.modalObject.opponent.id;
        }
        else {
            $scope.game_results = "You Tied!";
            $scope.modalObject.winner_id = null;
        }
    };

    $scope.finishGame = function () {
        $http.get("api/match/" + $scope.modalObject.id)
            .success(function (data) {
                if ($rootScope.userObject.id == $scope.modalObject.player1_id) {
                    data.score_1 = $scope.your_score;
                    data.score_2 = $scope.opponent_score;
                    data.winner_id = $scope.modalObject.winner_id;
                }
                else {
                    data.score_2 = $scope.your_score;
                    data.score_1 = $scope.opponent_score;
                    data.winner_id = $scope.modalObject.winner_id;
                }
                data.complete = 1;
                $http.put("api/match/" + data.id, data)
                    .success(function (data) {
                        console.log("Testing if we get into success.");
                        if (data.winner_id == $rootScope.userObject.id) {
                            if (data.score_1 > data.score_2) {
                                item.results = "WIN " + data.score_1 + "-" + data.score_2;
                            }
                            else {
                                item.results = "WIN " + data.score_2 + "-" + data.score_1;
                            }
                        }
                        else {
                            if (data.score_1 > data.score_2) {
                                item.results = "LOSS " + data.score_1 + "-" + data.score_2;
                            }
                            else {
                                item.results = "LOSS " + data.score_2 + "-" + data.score_1;
                            }
                        }
                        $scope.gamesip.splice(data, 1);
                        $scope.past_games.push(data);
                        $scope.no_past_games = "";
                    });
            });
    };

    $scope.accept = function (item) {
        console.log(item);
        $http.get("api/match/" + item)
            .success(function (data) {
                console.log("Sup dude");
                data.complete = 0;
                console.log("testing");
                $http.put("api/match/" + data.id, data);
                $scope.games_pending.splice(data, 1);
                $scope.gamesip.push(data);

            });
        console.log("Accepted the challenge.");
    };

    $scope.decline = function (item) {
        console.log(item);
        $http.get("api/match/" + item)
            .success(function (data) {
                console.log("Sup dude");
                $scope.games_pending.splice(data, 1);
            });

        $http.delete("api/match/" + item);
        console.log("Declined the challenge and removed match object from database.");
    };

}]);