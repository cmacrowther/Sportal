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

    //Setting unique user profile URL
    $scope.user_id = $routeParams.user_id;
    console.log("Profile Parameter user ID: " + $scope.user_id);

    //Set information on the profile page based on if they have values or not
    $http.get("/api/user/" + $scope.user_id)
        .success(function (data) {
            $scope.profileObject = data;

            if ($rootScope.userObject.id == $scope.profileObject.id) {
                $scope.editable = true;
            }
            else {
                $scope.editable = false;
            }

            //variable checks to see if we have values already.
            if ($scope.profileObject.first_name == "" || $scope.profileObject.first_name == undefined) {
                $scope.first_name = "John";
            }
            else {
                $scope.first_name = $scope.profileObject.first_name;
            }

            if ($scope.profileObject.last_name == "" || $scope.profileObject.last_name == undefined) {
                $scope.last_name = "Doe";
            }
            else {
                $scope.last_name = $scope.profileObject.last_name;
            }

            //Setting Page Name
            $rootScope.page_name = $scope.profileObject.first_name + " " + $scope.profileObject.last_name;

            //continuing variable checks
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
            if ($scope.profileObject.age == "" || $scope.profileObject.age == undefined) {
                $scope.age = "No info given";
            }
            else {
                $scope.age = $scope.profileObject.age;
            }
            if ($scope.profileObject.location == "" || $scope.profileObject.location == undefined) {
                $scope.location = "No info given";
            }
            else {
                $scope.location = $scope.profileObject.location;
            }

        })
        .error(function () {
            console.log("User does Not Exist");
            $scope.error = "User does Not Exist";
            window.location.assign("dashboard.html#/error/" + $scope.error);
        });

    //Function to toggle input fields for editing
    $scope.editPage = function () {
        $scope.edit = !$scope.edit;
    };

    //Updates core info based on inputs with ng-blur
    $scope.updateInfo = function () {
        $scope.profileObject.first_name = $scope.first_name;
        $scope.profileObject.last_name = $scope.last_name;
        $scope.profileObject.email = $scope.email;
        $scope.profileObject.picture = $scope.picture;
        $scope.profileObject.location = $scope.location;
        $scope.profileObject.age = $scope.age;
        $scope.profileObject.description = $scope.description;
        $http.put("api/user/" + $scope.profileObject.id, $scope.profileObject);
    };

    //Changes password
    $scope.changePassword = function () {
        if ($scope.profileObject.password == $scope.passwordCurrent) {
            $scope.profileObject.password = $scope.passwordNew;
            $http.put("api/user/" + $scope.profileObject.id, $scope.profileObject);
            $scope.password_message = "Password Changed Successfully!";

            $scope.passwordCurrent = null;
            $scope.passwordNew = null;
            $scope.passwordConfirm = null;

            $timeout(function () {
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
                        })
                });
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
            $scope.allSports = data.objects;
        });

    //Add a sport to your mySports list
    $scope.addSport = function (item) {
        var flag = false;
        angular.forEach($scope.mySports, function (value, index) {
            if (item.id == value.id) {
                flag = true;
            }
        });
        if (flag == false) {
            $http.post("/api/user_has_sport", {
                    user_id: $rootScope.userObject.id,
                    sport_id: item.id,
                    skill: item.skill
                })
                .success(function (data) {
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
                $scope.mySports.splice($scope.mySports.indexOf(item), 1);
                $http.delete("/api/user_has_sport/" + data)
                    .success(function (data) {
                        console.log("Sport successfully deleted");
                    })
            })
    };

}]);