/**
 * Created by Brandon on 1/20/2016.
 */
angular.module('dashboard.controllers').controller('gamesController', ['$scope', '$http', '$rootScope', '$routeParams', function ($scope, $http, $rootScope, $routeParams) {

    var passObject = {user_id: $rootScope.userObject.id};

    $scope.games_pending = [];
    $scope.gamesip = [];
    $scope.past_games = [];
    $scope.no_games_ip = "No Games in Progress";
    $scope.no_past_games = "No Past Games";
    $scope.no_games_pending = "No Games Pending";
    $rootScope.page_name = "Games";

    //Populate Pending Matches, Current Matches and Past Games lists
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
                    if (data[i].complete == 2 && data[i].player2_id == $rootScope.userObject.id) {
                        console.log("Challenge is present");
                        $scope.games_pending.push(data[i]);
                        $scope.no_games_pending = "";
                    }
                    else if (data[i].complete == 1) {
                        $scope.past_games.push(data[i]);
                        //todo add tie
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
                        if (data[i].complete == 0) {
                            $scope.gamesip.push(data[i]);
                            $scope.no_games_ip = "";
                        }
                    }
                }
            }
        });

    //Grabs a sports name using their ID
    $scope.getSport = function (item) {
        $http.get("/api/sport/" + item.sport_id)
            .success(function (data) {
                item.sport_name = data.name;
            })
    };

    //Grabs a users name to insert into the opponent column
    $scope.getUser = function (item) {
        var opponent_id = 0;
        if (item.player1_id == $rootScope.userObject.id) {
            opponent_id = item.player2_id;
        }
        else {
            opponent_id = item.player1_id;
        }
        $http.get("/api/user/" + opponent_id)
            .success(function (data) {
                item.opponent = data.first_name + " " + data.last_name;
            })
    };

    //Sends the opponent an email
    $scope.sendOpponentEmail = function (item) {
        $http.get("/api/user/" + item.player1_id)
            .success(function (data) {
                $http.post("api/send_mail_accepted", {
                        user: $rootScope.userObject.first_name + " " + $rootScope.userObject.last_name,
                        email: data.email
                    })
                    .success(function (data) {
                        console.log("Sent email to user.");
                    });
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
                        data.results = "WIN " + data.score_1 + "-" + data.score_2;
                    }
                    else {
                        data.results = "WIN " + data.score_2 + "-" + data.score_1;
                    }
                }
                else {
                    if (data.score_1 > data.score_2) {
                        data.results = "LOSS " + data.score_1 + "-" + data.score_2;
                    }
                    else {
                        data.results = "LOSS " + data.score_2 + "-" + data.score_1;
                    }
                }
                $scope.gamesip.splice(data, 1);
                $scope.past_games.push(data);
                $scope.no_past_games = "";
            });

            if ($rootScope.userObject.id == $scope.modalObject.player1_id) {
                $scope.opponent = $scope.modalObject.player2_id;
            }
            else {
                $scope.opponent = $scope.modalObject.player1_id;
            }

            $http.get("api/sport/" + $scope.modalObject.sport_id)
            .success(function(data){
                $http.post("api/user_has_notification", {
                    user_id: $scope.opponent,
                    notification: $rootScope.userObject.first_name + " " + $rootScope.userObject.last_name + " has posted the results of your " + data.name + " game.",
                    time: new Date(),
                    link: "#/games",
                    is_read: 0
                })
                .success(function(){
                    console.log("Notification Sent");
                })
            })
        });
    };

    $scope.accept = function (item) {
        console.log(item);
        $http.get("api/match/" + item)
            .success(function (data) {
                if (data.player1_id == $rootScope.userObject.id) {
                    $scope.opponent = data.player2_id;
                }
                else {
                    $scope.opponent = data.player1_id;
                }
                data.complete = 0;
                $http.put("api/match/" + data.id, data)
                    .success(function (data) {
                        $scope.games_pending.splice(data, 1);
                        $scope.gamesip.push(data);
                        $scope.no_games_ip = "";

                        $http.post("api/user_has_notification", {
                                user_id: $scope.opponent,
                                notification: $rootScope.userObject.first_name + " " + $rootScope.userObject.last_name + " has accepted your challenge.",
                                time: new Date(),
                                link: "#/games",
                                is_read: 0
                            })
                            .success(function () {
                                console.log("Notification Sent");
                            });
                    })
            });
    };

    $scope.decline = function (item) {
        console.log(item);
        $http.get("api/match/" + item)
        .success(function (data) {
            $scope.games_pending.splice(data, 1);
            if(data.player1_id == $rootScope.userObject.id) {
                $scope.opponent = data.player2_id;
            }
            else {
                $scope.opponent = data.player1_id;
            }
        });
        $http.delete("api/match/" + item);
        $http.post("api/user_has_notification", {
            user_id: $scope.opponent,
            notification: $rootScope.userObject.first_name + " " + $rootScope.userObject.last_name + " has declined your challenge.",
            time: new Date(),
            link: "#/games",
            is_read: 0
        })
        .success(function(){
            console.log("Notification Sent");
        })
    };
}]);