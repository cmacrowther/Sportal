/**
 * Created by Brandon on 1/20/2016.
 */

angular.module('dashboard.controllers').controller('user_profileController', ['$scope', '$timeout', '$rootScope', '$http', '$routeParams', function ($scope, $timeout, $rootScope, $http, $routeParams) {

    //Initializes the form validator plugin.
    $('#user_creation_form').validator();
    $('#changePassword').validator();

    //Initializes the date time picker plugin.
    $('#birth').datetimepicker({
        format: 'MM/DD/YYYY',
        viewMode: 'years'
    });

    $rootScope.page_name = $rootScope.userObject.first_name + " " + $rootScope.userObject.last_name;

    //console.log("NOTIFICATIONS: " + $rootScope.notifications[0].notification);

    //Setting unique user profile URL
    $scope.user_id = $routeParams.user_id;
    console.log("Profile Parameter user ID: " + $scope.user_id);

    //Set information on the profile page based on if they have values or not
    $http.get("/api/user/" + $scope.user_id)
        .success(function (data) {
            $scope.profileObject = data;

            console.log($scope.profileObject.first_name);

            if ($rootScope.userObject.id == $scope.profileObject.id) {
                $scope.editable = true;
            }
            else {
                $scope.editable = false;
            }

            //variable checks to see if we have values already.
            if ($scope.profileObject.first_name == "" || $scope.profileObject.first_name == undefined) {
                $scope.first_name = "No info given";
            }
            else {
                $scope.first_name = $scope.profileObject.first_name;
            }

            if ($scope.profileObject.last_name == "" || $scope.profileObject.last_name == undefined) {
                $scope.last_name = "No info given";
            }
            else {
                $scope.last_name = $scope.profileObject.last_name;
            }
            if ($scope.profileObject.description == "" || $scope.profileObject.description == undefined) {
                $scope.description = "No info given";
            }
            else {
                $scope.description = $scope.profileObject.description;
            }
            if ($scope.profileObject.email == "" || $scope.profileObject.email == undefined) {
                $scope.email = "No info given";
            }
            else {
                $scope.email = $scope.profileObject.email;
            }
            if ($scope.profileObject.picture == "" || $scope.profileObject.picture == undefined) {
                $scope.picture = "http://placehold.it/150x150";
            }
            else {
                $scope.picture = $scope.profileObject.picture;
            }
            if ($scope.profileObject.birth == "" || $scope.profileObject.birth == undefined) {
                $scope.birth = "No info given";
            }
            else {
                $scope.birth = $scope.profileObject.birth;
            }
            if ($scope.profileObject.address == "" || $scope.profileObject.address == undefined) {
                $scope.address = "No info given";
            }
            else {
                $scope.address = $scope.profileObject.address;
            }
            if ($scope.profileObject.address2 == "" || $scope.profileObject.address2 == undefined) {
                $scope.address2 = "No info given";
            }
            else {
                $scope.address2 = $scope.profileObject.address2;
            }
            if ($scope.profileObject.city == "" || $scope.profileObject.city == undefined) {
                $scope.city = "No info given";
            }
            else {
                $scope.city = $scope.profileObject.city;
            }
            if ($scope.profileObject.postal_code == "" || $scope.profileObject.postal_code == undefined) {
                $scope.postal_code = "No info given";
            }
            else {
                $scope.postal_code = $scope.profileObject.postal_code;
            }
            if ($scope.profileObject.province == "" || $scope.profileObject.province == undefined) {
                $scope.province = "No info given";
            }
            else {
                $scope.province = $scope.profileObject.province;
            }
            if ($scope.profileObject.country == "" || $scope.profileObject.country == undefined) {
                $scope.country = "No info given";
            }
            else {
                $scope.country = $scope.profileObject.country;
            }
            if ($scope.profileObject.gender == "" || $scope.profileObject.gender == undefined) {
                $scope.gender = "No info given";
            }
            else {
                $scope.gender = $scope.profileObject.gender;
            }
            if ($scope.profileObject.interests == "" || $scope.profileObject.interests == undefined) {
                $scope.interests = "No info given";
            }
            else {
                $scope.interests = $scope.profileObject.interests;
            }

        })
        .error(function () {
            console.log("User does Not Exist");
            $scope.error = "User does Not Exist";
            window.location.assign("dashboard.html#/error/" + $scope.error);
        });

    //Function to toggle input fields for editing
    $scope.editPage = function () {
        console.log("Edit = true.");
        $scope.edit = !$scope.edit;
    };

    //Updates core info based on inputs with ng-blur
    $scope.updateInfo = function () {
        console.log("Updating Info.");
        $scope.profileObject.first_name = $scope.first_name;
        $scope.profileObject.last_name = $scope.last_name;
        $scope.profileObject.email = $scope.email;
        $scope.profileObject.picture = $scope.picture;
        $http.put("api/user/" + $scope.profileObject.id, $scope.profileObject);
    };


    //todo fix this function. Currently will always say current password incorrect
    //Changes password
    $scope.changePassword = function () {
        if ($scope.profileObject.password == $scope.passwordCurrent) {
            $scope.profileObject.password = $scope.passwordNew;
            $http.put("api/user/" + $scope.profileObject.id, $scope.profileObject);
            $scope.password_message = "Password Changed Successfully!";

            $scope.passwordCurrent = null;
            $scope.passwordNew = null;
            $scope.passwordConfirm = null;

                $timeout(function() {
                    $scope.password_message = null;
                }, 3000);

        }
        else {
            console.log("Incorrect Password.");
            $scope.password_message = "Current Password Incorrect";
        }
    };

    //Something for when you click the set difficulty button in mySports list
    $scope.setSportModal = function (item) {
        $scope.sportModal = item;
    };

    //sets the difficulty when adding sports ############## FIX THIS ################
    $scope.setDifficulty = function (skill) {
        console.log("Change skill: " + skill);
        passObject = {user_id: $rootScope.userObject.id, sport_id: $scope.sportModal.id};
        $http({
            method: 'POST',
            url: 'api/get_user_has_sport_id',
            headers: {'Content-Type': 'application/json'},
            data: JSON.stringify(passObject)
        }).success(function (data) {
            $http.get("/api/user_has_sport/" + data)
                .success(function (data) {
                    data.skill = skill;
                    $http.put("/api/user_has_sport/" + data.id, data)
                        .success(function (item) {
                            console.log("Skill Level Updated");
                        })
                });
            console.log('data.id' + data + "skill: " + skill);
        })
    };

    //Get list of sports from users mySports list
    var passObject = {user_id: $routeParams.user_id};
    $http({
        method: 'POST',
        url: 'api/get_user_sports',
        headers: {'Content-Type': 'application/json'},
        data: JSON.stringify(passObject)
    }).success(function (data) {
        console.log(data);

        if (data == "no sports") {
            $scope.mySports = [];
        }
        else {
            $scope.mySports = data;
        }

    });

    //Get all the sports that have been added by an admin
    $http.get("/api/sport")
        .success(function (data) {
            console.log(data);
            $scope.allSports = data.objects;
        });

    //Add a sport to your mySports list
    $scope.addSport = function (item) {
        var flag = false;
        angular.forEach($scope.mySports, function (value, index) {
            if (item.id == value.id) {
                flag = true;
                console.log("Duplicate");
            }
        });
        if (flag == false) {
            $http.post("/api/user_has_sport", {
                    user_id: $rootScope.userObject.id,
                    sport_id: item.id,
                    skill: item.skill
                })
                .success(function (data) {
                    console.log(data);
                    console.log("Sport added to user profile");
                    $scope.mySports.push(item);
                })
        }
    };

    //Remove a sport from your mySports list
    $scope.deleteSport = function (item) {
        passObject = {user_id: $rootScope.userObject.id, sport_id: item.id};
        $http({
            method: 'POST',
            url: 'api/get_user_has_sport_id',
            headers: {'Content-Type': 'application/json'},
            data: JSON.stringify(passObject)
        })
            .success(function (data) {
                console.log(data);
                $scope.mySports.splice($scope.mySports.indexOf(item), 1);
                $http.delete("/api/user_has_sport/" + data)
                    .success(function (data) {
                        console.log("Sport successfully deleted");
                    })
            })
    }

    $scope.is_read_set = function (item) {
        console.log("Notification Read.");
        item.is_read = 1;
        if (item.team_id) {
            $http.put("/api/team_has_notification/" + item.id, item);
        }
        else {
            $http.put("/api/user_has_notification/" + item.id, item);
        }

    }

}]);