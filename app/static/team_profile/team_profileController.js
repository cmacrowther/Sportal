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

        passObject = {user: $rootScope.userObject.first_name, receivers: $scope.email, team: $scope.team_name, password: $scope.team_password};

        $http({
            method: 'POST',
            url: 'api/send_mail',
            headers: {'Content-Type': 'application/json'},
            data: JSON.stringify(passObject)
        })
        .success(function(data){
            if (data == "Successfully sent"){
                $scope.sendMessageResult = "Message Sent Successfully";
            }
            else {
                console.log("Error Sending Mail");
            }
        })


    }

    //sets the difficulty when adding sports ############## FIX THIS ################
    $scope.setDifficulty = function(difficulty, item) {

        passObject = {user_id: $rootScope.userObject.id, sport_id: item.id};

        $http({
            method: 'POST',
            url: 'api/get_user_has_sport',
            headers: {'Content-Type': 'application/json'},
            data: JSON.stringify(passObject)           
        })
        .success(function(data){
            data.skill = difficulty;
            $http.put("/api/user_has_sport/" + data.id, data)
            .success(function(item){
                console.log("Skill Level Updated");
            })
        })
        
    }

}]);