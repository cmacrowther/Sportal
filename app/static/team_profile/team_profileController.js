/**
 * Created by Brandon on 1/20/2016.
 */
angular.module('dashboard.controllers').controller('team_profileController', ['$scope', '$http', '$rootScope', '$routeParams', function ($scope, $http, $rootScope, $routeParams) {

    console.log($routeParams.url);

    var passObject = {url: $routeParams.url};

    $http({
        method: 'POST',
        url: 'api/get_team_info',
        headers: {'Content-Type': 'application/json'},
        data: JSON.stringify(passObject)
    })
    .success(function(data){

        $scope.teamObject = data[0];

        if ($scope.teamObject.name == "" || $scope.teamObject.name == undefined) {
            $scope.team_name = "No info given";
        }
        else {
            $scope.team_name = $scope.teamObject.name;
        }

        if ($scope.teamObject.adminId == "" || $scope.teamObject.adminId == undefined) {
            $scope.admin = "No info given";
        }
        else {
            $scope.admin = $scope.teamObject.adminId;
        }
        if ($scope.teamObject.sport_id == "" || $scope.teamObject.sport_id == undefined || $scope.teamObject.sport_id == 0) {
            $scope.team_sport = "No info given";
        }
        else {
            $http.get("/api/sport/" + $scope.teamObject.sport_id)
            .success(function(data){
                $scope.sportObject = data;
                $scope.team_sport = $scope.sportObject.name;
            })
            .error(function(data){
                console.log("Error getting sport.");
            })
        }
        if ($scope.teamObject.description == "" || $scope.teamObject.description == undefined) {
            $scope.description = "No info given";
        }
        else {
            $scope.description = $scope.teamObject.description;
        }
        if ($scope.teamObject.picture == "" || $scope.teamObject.picture == undefined) {
            $scope.picture = "http://placehold.it/150x150";
        }
        else {
            $scope.picture = $scope.teamObject.picture;
        }

        if($rootScope.userObject.id == $scope.teamObject.adminId) {
            $scope.editable = true;
        }
        else {
            $scope.editable = false;
        }

        passObject = {team_id: $scope.teamObject.id};

        console.log(passObject);

        //todo: fix so that it pulls from user_has_team
        $http({
            method: 'POST',
            url: 'api/get_team_members',
            headers: {'Content-Type': 'application/json'},
            data: JSON.stringify(passObject)
        })
        .success(function (data) {
            console.log(data);
            $scope.team_members = data;
        })
    })

    //initializes bootstrap validator
    $("#inviteForm").validator();

    console.log("team_profile Page");

    $scope.sendMail = function() {

        console.log($rootScope.userObject.first_name);
        console.log($scope.email);
        console.log($scope.team_name);        
        console.log($scope.team_password);

        passObject = {user: $rootScope.userObject.first_name, email: $scope.email, team: $scope.team_name, password: $scope.team_password};

        $http({
            method: 'POST',
            url: 'api/send_mail',
            headers: {'Content-Type': 'application/json'},
            data: JSON.stringify(passObject)
        })
        .success(function(data){
            console.log("Success");
            if (data == "Successfully sent"){
                $scope.sendMessageResult = "Message Sent Successfully";
                console.log("Message Sent Successfully");
            }
            else {
                console.log("Error Sending Mail");
            }
        })
    }

    $('#inviteForm').validator().on('submit', function (e) {
        if (e.isDefaultPrevented()) {
            console.log("Form Error");
        } else {
            //check for team and password
            $scope.sendMail();
        }
    })

    $scope.editPage = function () {
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

        $scope.teamObject.name = $scope.team_name;
        $scope.teamObject.url = $scope.team_name;
        $scope.teamObject.adminId = $scope.admin;
        $scope.teamObject.description = $scope.description;
        $scope.teamObject.picture = $scope.picture;

        $http.put("api/team/" + $scope.teamObject.id, $scope.teamObject);
        $rootScope.teams.splice($scope.teamObject.id-1, 1, $scope.teamObject);
        window.location.assign("#/team_profile/" + $scope.teamObject.name);
    }

    //Updates team sport from dropdown
    $scope.updateTeamSport = function() {

        console.log("Changing Team Sport");

        $http.get("/api/sport/" + $scope.team_sport_id)
        .success(function(data){
            $scope.teamObject.sport_id = data.id;
            $scope.team_sport = data.name;
            $scope.updateInfo();
        })
        .error(function(data){
            console.log("Error getting sport.");
        })
    }

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
    }

    $scope.unique_team_name = function() {

        console.log("TEAM NAME: "+ $scope.team_name)
        
        if($scope.team_name != $scope.teamObject.name){
            console.log("team names not same");

            var passObject = {name: $scope.team_name};

           //Checks if url is taken

           console.log(passObject);

            $http({
                method: 'POST',
                url: 'api/team_name_check',
                headers: {'Content-Type': 'application/json'},
                data: JSON.stringify(passObject)
            })
            .then(function(data){
                console.log(data.data);

                if(data.data == "noduplicate"){
                   $scope.updateInfo();
                }
                else{
                    alert("Duplicate Name");
                    window.location.assign('#/team_profile/' + $scope.teamObject.url);
                }
            })
        }
        else {
            return true;
        }
    }

    $http.get("/api/sport")
        .success(function (data) {
            console.log(data);
            $scope.allSports = data.objects;
        })





    

}]);