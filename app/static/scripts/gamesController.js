/**
 * Created by Brandon on 1/20/2016.
 */
angular.module('dashboard.controllers').controller('gamesController', ['$scope', '$http', '$rootScope', '$routeParams', function ($scope, $http, $rootScope, $routeParams) {

    var passObject = {user_id: $rootScope.userObject.id};

    //user games lists and variables
    $scope.games_pending = [];
    $scope.gamesip = [];
    $scope.past_games = [];
    $scope.no_games_ip = "No Games in Progress";
    $scope.no_past_games = "No Past Games";
    $scope.no_games_pending = "No Games Pending";

    //team games lists and variables
    $scope.team_games_pending = [];
    $scope.team_gamesip = [];
    $scope.team_past_games = [];
    $scope.team_no_games_ip = "No Team Games in Progress";
    $scope.team_no_past_games = "No Past Team Games";
    $scope.team_no_games_pending = "No Team Games Pending";

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
        if (data == "no games") {
            //do nothing
        }
        else {
            for (var i = 0; i < data.length; i++) {

                //fills the list of user games
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
                    $scope.gamesip.push(data[i]);
                    $scope.no_games_ip = "";
                }

            //end of for loop    
            }
        }
    });

    //Populate Pending Team Matches, Current Team Matches and Past Team Games lists
    $http({
        method: 'POST',
        url: 'api/get_team_games',
        headers: {'Content-Type': 'application/json'},
        data: JSON.stringify(passObject)
    })
    .success(function (data) {
        console.log(data);
        if (data == "no games") {
            //do nothing
        }
        else {
            for (var i = 0; i < data.length; i++) {

                //fills the list of games for a team
                if (data[i].complete == 2) {
                    console.log("Challenge is present");
                    $scope.team_games_pending.push(data[i]);
                    $scope.team_no_games_pending = "";
                }
                else if (data[i].complete == 1) {

                    $scope.team_past_games.push(data[i]);
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
                    $scope.team_no_past_games = "";
                    
                }
                else {
                    $scope.team_gamesip.push(data[i]);
                    $scope.team_no_games_ip = "";
                }

            //end of for loop    
            }
        }
    });

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

    //---------------------------------------------------------------
    // Gets the proper names for listing matches information
    $scope.getSport = function (item) {
        $http.get("/api/sport/" + item.sport_id)
            .success(function (data) {
                item.sport_name = data.name;
            })
    };
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
    $scope.getYourTeam = function (item) {
        $http.get("/api/team/" + item.your_team_id)
        .success(function (data) {
            item.your_team = data.name;
        })
    }
    $scope.getOpponentTeam = function (item) {
        $http.get("/api/team/" + item.opponent_id)
        .success(function (data) {
            item.opponent = data.name;
        })
    }
    //---------------------------------------------------------------

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

    //setting modal to display unique match info
    $scope.setModal = function (item) {
        $scope.modalObject = item;
    };

    $scope.updateInfo = function () {
        $http.get("api/match/" + $scope.modalObject.id)
            .success(function (data) {
                data.facility_id = $scope.game_location;
                data.date = $scope.modalObject.game_date;
                data.time = $scope.modalObject.game_time;
                $http.put("api/match/" + data.id, data)
                .success(function(data){
                    console.log("Game Updated");
                })
            })
    };


    //automatically update the winner when inputting score (ng-blur, user games only)
    $scope.getWinnerUSER = function () {
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

    //automatically update the winner when inputting score (ng-blur, team games only)
    $scope.getWinnerTEAM = function () {
        if ($scope.your_team_score > $scope.opponent_team_score) {
            $scope.game_results = "Your Team Won! :)";
            $scope.modalObject.winner_id = $scope.modalObject.your_team_id;
        }
        else if ($scope.your_team_score < $scope.opponent_team_score) {
            $scope.game_results = "You Lost! :(";
            $scope.modalObject.winner_id = $scope.modalObject.opponent_id;
        }
        else {
            $scope.game_results = "You Tied!";
            $scope.modalObject.winner_id = null;
        }
    };

    //finish game function, logs results in DB
    $scope.finishGame = function () {
        $http.get("api/match/" + $scope.modalObject.id)
        .success(function (data) {
            //TODO:   create a different method for finishing a team game
            if (data.is_team == 1) {

                //is a team game
                if ($scope.modalObject.your_team_id == data.player1_id) {
                    data.score_1 = $scope.your_team_score;
                    data.score_2 = $scope.opponent_score;
                    data.winner_id = $scope.modalObject.winner_id;
                }
                else {
                    data.score_2 = $scope.your_team_score;
                    data.score_1 = $scope.opponent_score;
                    data.winner_id = $scope.modalObject.winner_id;
                }
                data.complete = 1;
                $http.put("api/match/" + data.id, data)
                .success(function (data) {
                    console.log("Testing if we get into success.");
                    if (data.winner_id == $scope.modalObject.your_team_id) {
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
                    $scope.team_gamesip.splice(data, 1);
                    $scope.team_past_games.push(data);
                    $scope.team_no_past_games = "";
                });

                if ($scope.modalObject.your_team_id == $scope.modalObject.player1_id) {
                    $scope.opponent = $scope.modalObject.player2_id;
                }
                else {
                    $scope.opponent = $scope.modalObject.player1_id;
                }

                $http.get("api/sport/" + $scope.modalObject.sport_id)
                .success(function(data){
                    $http.post("api/team_has_notification", {
                        team_id: $scope.opponent,
                        notification: $scope.modalObject.your_team + " have posted the results of your " + data.name + " game.",
                        time: new Date(),
                        link: "#/games",
                        is_read: 0
                    })
                    .success(function(){
                        console.log("Notification Sent");
                    })
                })



            }
            else {

                //is a 1VS1 game
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
            }
        });
    };


    //accept function for pending matches
    $scope.accept = function (item) {
        console.log(item);
        $http.get("api/match/" + item)
        .success(function (data) {

            if (data.is_team == 1) {
                data.complete = 0;
                $http.put("api/match/" + data.id, data)
                .success(function (data) {
                    $scope.team_games_pending.splice(data, 1);
                    $scope.team_gamesip.push(data);
                    $scope.team_no_games_ip = "";
                    $scope.team1 = data.player1_id;
                    $scope.team2 = data.player2_id;

                    $http.get("api/sport/" + data.sport_id)
                    .success(function(data){
                        $scope.sport = data.name;

                        $http.post("api/team_has_notification", {
                            team_id: $scope.team1,
                            notification: "One of your teams has agreed to a game of " + $scope.sport + ".",
                            time: new Date(),
                            link: "#/games",
                            is_read: 0
                        })
                        .success(function () {
                            console.log("Team 1 Notification Sent");

                            $http.post("api/team_has_notification", {
                                team_id: $scope.team2,
                                notification: "One of your teams has agreed to a game of " + $scope.sport + ".",
                                time: new Date(),
                                link: "#/games",
                                is_read: 0
                            })
                            .success(function () {
                                console.log("Team 2 Notification Sent");
                            });
                        });
                    })
                })

            }
            else {
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
                        console.log("User Notification Sent");
                    });
                })
            }
        });
    };

    //decline function for pending matches
    $scope.decline = function (item) {
        console.log(item);
        $http.get("api/match/" + item)
        .success(function (data) {

            if (data.is_team == 1) {    
                $scope.team_games_pending.splice(data, 1);
                //send a notification for team decline
                $scope.team_declining = data.player2_id;
                $scope.team_getting_declined = data.player1_id;

                $http.post("api/team_has_notification", {
                            team_id: $scope.team_declining,
                            notification: "One of your teams has declined a challenge.",
                            time: new Date(),
                            link: "#/games",
                            is_read: 0
                        })
                        .success(function () {
                            console.log("Team 1 Notification Sent");

                            $http.post("api/team_has_notification", {
                                team_id: $scope.team_getting_declined,
                                notification: "One of your teams challenges was declined.",
                                time: new Date(),
                                link: "#/games",
                                is_read: 0
                            })
                            .success(function () {
                                console.log("Team 2 Notification Sent");
                            });
                        });
            }
            else {
                $scope.games_pending.splice(data, 1);
                if(data.player1_id == $rootScope.userObject.id) {
                    $scope.opponent = data.player2_id;
                }
                else {
                    $scope.opponent = data.player1_id;
                }
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
            }
        });
        $http.delete("api/match/" + item);
    };

    $scope.isYourTeam = function (id1, id2) {
        for (var i = 0; i < $rootScope.teams.length; i++) {
            if (id1 != $rootScope.teams[i].id || id2 != $rootScope.teams[i].id) {
                //haven't matched yet
            }
            else {
                return true;
            }
        }
        //if function reaches here, there has been no team found
        return false;
    }
}]);