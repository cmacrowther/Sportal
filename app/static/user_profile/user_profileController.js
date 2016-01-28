/**
 * Created by Brandon on 1/20/2016.
 */

angular.module('dashboard.controllers').controller('user_profileController', ['$scope', '$rootScope', '$http', '$routeParams', function ($scope, $rootScope, $http, $routeParams) {

    $scope.user_id = $routeParams.user_id;

    var passObject = {user_id: $rootScope.userObject.id}

    console.log("Profile Param " + $scope.user_id);

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
    .error(function(){
        console.log("User does Not Exist");
        $scope.error = "User does Not Exist";
        window.location.assign("dashboard.html#/error/" + $scope.error);
    })

    //Initializes the form validator plugin.
    $("#user_creation_form").validator();
    $("#changePassword").validator();

    //Initializes the date time picker plugin.
    $('#birth').datetimepicker({
        format: 'MM/DD/YYYY',
        viewMode: 'years'
    });

   

    //Function to toggle between either info displaying or input fields for editing
    $scope.editPage = function () {
        console.log("Edit = true.")
        if ($scope.edit) {
            $scope.edit = false;
        }
        else {
            $scope.edit = true;
        }
    }

    //Function to update info based on inputs with ng-blur
    $scope.updateInfo = function () {
        console.log("Updating Info.");

        $scope.profileObject.first_name = $scope.first_name;
        $scope.profileObject.last_name = $scope.last_name;
        $scope.profileObject.email = $scope.email;
        $scope.profileObject.picture = $scope.picture;

        $http.put("api/user/" + $scope.profileObject.id, $scope.profileObject);
    }

    $scope.changePassword = function () {

        if ($scope.profileObject.password == $scope.passwordCurrent) {
            $scope.profileObject.password = $scope.passwordNew;
            $http.put("api/user/" + $scope.profileObject.id, $scope.profileObject);
            $scope.password_message = "Password Changed Successfully!";
        }
        else {
            console.log("Incorrect Password.")
            $scope.password_message = "Current Password Incorrect";
        }
    }

    $scope.setSportModal= function(item) {
        $scope.sportModal = item;
    }
    //sets the difficulty when adding sports ############## FIX THIS ################
    $scope.setDifficulty = function(skill) {

        console.log("Change skill: " + skill);
       
        passObject = {user_id: $rootScope.userObject.id, sport_id: $scope.sportModal.id};

        $http({
            method: 'POST',
            url: 'api/get_user_has_sport_id',
            headers: {'Content-Type': 'application/json'},
            data: JSON.stringify(passObject)           
        })
        .success(function(data){

            $http.get("/api/user_has_sport/" + data)
            .success(function(data){

                data.skill = skill;

                $http.put("/api/user_has_sport/" + data.id, data)
                    .success(function(item){
                        console.log("Skill Level Updated");
                    })
            })
            console.log('data.id' + data + "skill: " + skill);

            
        })
    }

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
            $scope.allSports = data.objects;
        })

    $scope.addSport = function (item) {

        var flag = false;

        angular.forEach($scope.mySports, function(value, index){
            if (item.id == value.id){
                flag = true;
                console.log("Duplicate");
            }
        })
        if (flag == false) {
            
            $http.post("/api/user_has_sport", {
                user_id: $rootScope.userObject.id,
                sport_id: item.id,
                skill: item.skill
            })
            .success(function(data) {
                console.log(data);
                console.log("Sport added to user profile");
                $scope.mySports.push(item);
            })
        }

    }

    $scope.deleteSport = function (item) {

        passObject = {user_id: $rootScope.userObject.id , sport_id: item.id}

        $http({
            method: 'POST',
            url: 'api/get_user_has_sport_id',
            headers: {'Content-Type': 'application/json'},
            data: JSON.stringify(passObject)
        })
        .success(function(data) {
            console.log(data);
            $scope.mySports.splice($scope.mySports.indexOf(item), 1);

            $http.delete("/api/user_has_sport/" + data)
            .success(function(data){
                console.log("Sport successfully deleted");
            })
        })

    }

}]);