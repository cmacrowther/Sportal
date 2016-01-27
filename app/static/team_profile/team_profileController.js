/**
 * Created by Brandon on 1/20/2016.
 */
angular.module('dashboard.controllers').controller('team_profileController', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {

    //initializes bootstrap validator
    $("#inviteForm").validator();

    console.log("team_profile Page");

    var passObject = {user_id: $rootScope.userObject.id}

    //variables
    $scope.novice = "1";
    $scope.intermediate = "2";
    $scope.expert = "3";

    $scope.difficulties = ['Novice', 'Intermediate', 'Expert'];

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

}]);