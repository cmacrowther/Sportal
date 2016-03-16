/**
 * Created by Brandon on 1/20/2016.
 */
angular.module('dashboard.controllers').controller('team_profileController', ['$scope', '$http', '$rootScope', '$timeout', '$routeParams', function ($scope, $http, $rootScope, $timeout, $routeParams) {

    console.log($routeParams.url);

    var passObject = {url: $routeParams.url};

    $rootScope.page_name = $routeParams.url;

    $http({
        method: 'POST',
        url: 'api/get_team_info',
        headers: {'Content-Type': 'application/json'},
        data: JSON.stringify(passObject)
    }).success(function (data) {
        if (data != "it fucked up") {
            $scope.teamObject = data[0];

            if ($scope.teamObject.name == "" || $scope.teamObject.name == undefined) {
                $scope.team_name = "No info given";
            }
            else {
                $scope.team_name = $scope.teamObject.name;
            }
            if ($scope.teamObject.sport_id == "" || $scope.teamObject.sport_id == undefined || $scope.teamObject.sport_id == 0) {
                $scope.team_sport = "No info given";
            }
            else {
                $http.get("/api/sport/" + $scope.teamObject.sport_id)
                    .success(function (data) {
                        $scope.sportObject = data;
                        $scope.team_sport = $scope.sportObject.name;
                    })
                    .error(function (data) {
                        console.log("Error getting sport.");
                    })
            }
            if ($scope.teamObject.description == "" || $scope.teamObject.description == undefined) {
                $scope.description = "No info given";
            }
            else {
                $scope.description = $scope.teamObject.description;
            }
            if ($scope.teamObject.location == "" || $scope.teamObject.location == undefined) {
                $scope.location = "No Info Given";
            }   
            else {
                $scope.location = $scope.teamObject.location;
            }
            if ($scope.teamObject.picture == "" || $scope.teamObject.picture == undefined) {
                $scope.picture = "http://placehold.it/150x150";
            }
            else {
                $scope.picture = $scope.teamObject.picture;
            }

            passObject = {team_id: $scope.teamObject.id};

            console.log(passObject);

            //pulls all team members
            $http({
                method: 'POST',
                url: 'api/get_team_members',
                headers: {'Content-Type': 'application/json'},
                data: JSON.stringify(passObject)
            })
                .success(function (data) {
                    $scope.team_members = data;
                });

            //pulls team admins
            $http({
                method: 'POST',
                url: 'api/get_team_admins',
                headers: {'Content-Type': 'application/json'},
                data: JSON.stringify(passObject)
            })
                .success(function (data) {
                    $scope.team_admins = data;
                    for (var i = 0; i < $scope.team_admins.length; i++) {
                        if ($rootScope.userObject.id == $scope.team_admins[i].id) {
                            $scope.editable = true;
                        }
                        else {
                            //nothing
                        }
                    }
                })
        }
        else {
            console.log("Team does Not Exist");
            $scope.error = "Team does Not Exist";
            window.location.assign("dashboard.html#/error/" + $scope.error);
        }
    });


    //initializes bootstrap validator
    $("#inviteForm").validator();

    console.log("team_profile Page");

    $scope.sendMail = function () {

        $scope.emailLoad = true;
        //console.log($rootScope.userObject.first_name);
        //console.log($scope.email);
        //console.log($scope.team_name);
        //console.log($scope.team_password);

        console.log("1 " + $rootScope.userObject.first_name);
        console.log("2 " + $scope.email);
        console.log("3 " + $scope.teamObject.name);
        console.log("4 " + $scope.teamObject.password);

        //passObject = {user: $rootScope.userObject.first_name, email: $scope.email, team: $scope.team_name, password: $scope.team_password};
        passObject = {
            user: $rootScope.userObject.first_name,
            email: $scope.email,
            team: $scope.teamObject.name,
            password: $scope.teamObject.password
        };


        $http({
            method: 'POST',
            url: 'api/send_mail',
            headers: {'Content-Type': 'application/json'},
            data: JSON.stringify(passObject)
        })
            .success(function (data) {
                $scope.emailLoad = false;

                console.log("Success");
                if (data == "Successfully sent") {
                    $scope.sendMessageResult = "Message Sent Successfully";
                    console.log("Message Sent Successfully");
                    $timeout(function () {
                        console.log("TIMEOUT YA!");
                        $scope.sendMessageResult = "";
                    }, 3000);
                }
                else {
                    console.log("Error Sending Mail");
                }
            })
    };

    $('#inviteForm').validator().on('submit', function (e) {
        if (e.isDefaultPrevented()) {
            console.log("Form Error");
        } else {
            //check for team and password
            $scope.sendMail();
        }
    });

    $scope.editPage = function () {
        $scope.edit = !$scope.edit;
    };

    //Function to update info based on inputs with ng-blur
    $scope.updateInfo = function () {

        console.log("Updating Info.");

        var passObject = {team_id: $scope.teamObject.id};

        $http({
            method: 'POST',
            url: 'api/get_team_has_channel',
            headers: {'Content-Type': 'application/json'},
            data: JSON.stringify(passObject)
        })
            .success(function (data) {
                $http.get("api/channel/" + data[0].channel_id)
                    .success(function (data) {
                        data.name = $scope.team_name;
                        $http.put("api/channel/" + data.id, data);
                    })
            })

        if ($scope.teamObject.name != $scope.team_name) {
            $scope.change_windows = true;
        }

        $scope.teamObject.name = $scope.team_name;
        $scope.teamObject.url = $scope.team_name;
        $scope.teamObject.adminId = $scope.admin;
        $scope.teamObject.description = $scope.description;
        $scope.teamObject.picture = $scope.picture;
        $scope.teamObject.location = $scope.location;

        $http.put("api/team/" + $scope.teamObject.id, $scope.teamObject)
        .success(function(data){
            $rootScope.teams.splice($rootScope.teams.indexOf($scope.teamObject), 1, $scope.teamObject);

            $http.post("/api/team_has_notification", {
                team_id: $scope.teamObject.id,
                notification: "There has been a change to " + $scope.teamObject.url + "'s team profile page.",
                time: new Date(),
                link: "#/team_profile/" + $scope.teamObject.url,
                is_read: 0
            })
            .success(function (data) {
                console.log("Notification Sent.");
            })
        })
        
        
        if($scope.change_windows) {
           window.location.assign("#/team_profile/" + $scope.teamObject.name); 
        }
    };

    //Updates team sport from dropdown
    $scope.updateTeamSport = function () {

        console.log("Changing Team Sport");

        $http.get("/api/sport/" + $scope.team_sport_id)
            .success(function (data) {
                $scope.teamObject.sport_id = data.id;
                $scope.team_sport = data.name;
                $scope.updateInfo();
            })
            .error(function (data) {
                console.log("Error getting sport.");
            })
    };

    $scope.changePassword = function () {

        if ($scope.teamObject.password == $scope.passwordCurrent) {
            $scope.teamObject.password = $scope.passwordNew;
            $http.put("api/team/" + $scope.teamObject.id, $scope.teamObject);
            $scope.password_message = "Password Changed Successfully!";
        }
        else {
            console.log("Incorrect Password.");
            $scope.password_message = "Current Password Incorrect";
        }
        $timeout(function() {
            $scope.password_message = null;
        }, 3000);
    };

    $scope.unique_team_name = function () {

        if ($scope.team_name != $scope.teamObject.name) {

            var passObject = {name: $scope.team_name};

            //Checks if url is taken
            $http({
                method: 'POST',
                url: 'api/team_name_check',
                headers: {'Content-Type': 'application/json'},
                data: JSON.stringify(passObject)
            })
                .then(function (data) {
                    console.log(data.data);
                    if (data.data == "noduplicate") {
                        $scope.updateInfo();
                    }
                    else {
                        alert("Duplicate Name");
                        window.location.assign('#/team_profile/' + $scope.teamObject.url);
                    }
                })
        }
        else {
            return true;
        }
    };

    $http.get("/api/sport")
        .success(function (data) {
            $scope.allSports = data.objects;
        });

    $scope.promote = function (item) {

        var passObject = {team_id: $scope.teamObject.id, promotee: item.id};

        $http({
            method: 'POST',
            url: 'api/team_admin_check',
            headers: {'Content-Type': 'application/json'},
            data: JSON.stringify(passObject)
        })
            .success(function (data) {
                if (data == "promote") {
                    $http.post("api/team_has_admin", {
                            user_id: item.id,
                            team_id: $scope.teamObject.id
                        })
                        .success(function (data) {
                            console.log("User Promoted!");
                            $http.get("/api/user/" + data.user_id)
                                .success(function (data) {
                                    $scope.team_admins.push(data);
                                })
                        })
                }
                else {
                    console.log("Already an Admin");
                    alert("That Member is Already An Admin!");
                }
            })
    };

    $scope.kick = function (item) {

        //available to team admins
        var passObject = {team_id: $scope.teamObject.id, user_id: item.id};
        console.log(passObject);

        $http({
            method: 'POST',
            url: 'api/get_member',
            headers: {'Content-Type': 'application/json'},
            data: JSON.stringify(passObject)
        })
            .success(function (data) {
                console.log(data);

                $http.delete("/api/user_has_team/" + data[0].id)
                    .success(function () {
                        console.log("Team Member Deleted.");
                        $scope.team_members.splice(item, 1)
                    })
            })
    };

    $scope.leaveTeam = function () {

        //available to team admins
        var passObject = {team_id: $scope.teamObject.id, user_id: $rootScope.userObject.id};

        $http({
            method: 'POST',
            url: 'api/get_member',
            headers: {'Content-Type': 'application/json'},
            data: JSON.stringify(passObject)
        })
            .success(function (data) {
                console.log(data);
                $http.delete("/api/user_has_team/" + data[0].id)
                    .success(function () {
                        console.log("Team Left.");
                        $rootScope.teams.splice($rootScope.teams.indexOf($scope.teamObject.id), 1);
                        window.location.assign("#/");
                    })
            })
    };

    $scope.demote = function (item) {

        //available to team admins
        var passObject = {team_id: $scope.teamObject.id, user_id: item.id};

        $http({
            method: 'POST',
            url: 'api/get_admin',
            headers: {'Content-Type': 'application/json'},
            data: JSON.stringify(passObject)
        })
            .success(function (data) {
                console.log(data);

                $http.delete("/api/team_has_admin/" + data[0].id)
                    .success(function () {
                        console.log("Team Admin Demoted.");
                        $scope.team_admins.splice(item, 1)
                    })
            })
    };

    $scope.deleteTeam = function (item) {

        //available to team admins
        $http.delete("/api/team/" + $scope.teamObject.id)
            .success(function (data) {
                console.log("Team Deleted. ddddddddddddddd" + $rootScope.userObject.id);

                var passObject = {team_id: $scope.teamObject.id};

                $http({
                    method: 'POST',
                    url: 'api/get_team_members_for_deletion',
                    headers: {'Content-Type': 'application/json'},
                    data: JSON.stringify(passObject)
                })
                    .success(function (data) {
                        for (var i = 0; i < data.length; i++) {
                            $http.delete("/api/user_has_team/" + data[i].id)
                                .success(function () {
                                    console.log("User " + i + " deleted.");
                                    var passObject = {user_id: $rootScope.userObject.id};

                                    $http({
                                        method: 'POST',
                                        url: 'api/get_user_teams',
                                        headers: {'Content-Type': 'application/json'},
                                        data: JSON.stringify(passObject)
                                    })
                                        .success(function (data) {
                                            console.log(data);
                                            if (data == "no teams") {
                                                $rootScope.teams = [];
                                            }
                                            else {
                                                $rootScope.teams = data;
                                            }
                                        });
                                })
                        }
                        var passObject = {team_id: $scope.teamObject.id};
                        $http({
                            method: 'POST',
                            url: 'api/get_team_admins_for_deletion',
                            headers: {'Content-Type': 'application/json'},
                            data: JSON.stringify(passObject)
                        })
                            .success(function (data) {
                                for (var i = 0; i < data.length; i++) {
                                    $http.delete("/api/team_has_admin/" + data[i].id)
                                        .success(function () {
                                            console.log("Admin " + i + " deleted.")
                                        })
                                }

                                $http({
                                    method: 'POST',
                                    url: 'api/get_team_has_channel',
                                    headers: {'Content-Type': 'application/json'},
                                    data: JSON.stringify(passObject)
                                })
                                    .success(function (data) {
                                        $http.delete("/api/team_has_channel/" + data.id);
                                        $http.delete("/api/channel/" + data.channel_id);
                                    })


                                alert("Team Has Been Deleted.");
                                window.location.assign("#/");
                            })

                    })
            })
    };

    $scope.checkID = function (item) {
        return item.id != $rootScope.userObject.id;
    };
}]);