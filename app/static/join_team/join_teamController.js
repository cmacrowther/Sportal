angular.module('dashboard.controllers').controller('join_teamController', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
	
	//Initializes the validator plugin
	$('#teamForm').validator();

	$scope.joinTeam = function() {

		var passObject = {url: $scope.team_name, password: $scope.team_password};

		$http({
                method: 'POST',
                url: 'api/join_team',
                headers: {'Content-Type': 'application/json'},
                data: JSON.stringify(passObject)
        })
        .success(function(data){
        	if (data == "Password Incorrect") {
        		$scope.team_name_dne_error = "Password Incorrect";
        		console.log("Password Incorrect"); 
        	}
        	else if (data == "No Team with that name") {
        		$scope.team_name_dne_error = "Team Does Not Exist";
        		console.log("Team DNE");
        	}
        	else {
        		console.log("Team Joined");
        		$scope.joinTeamResult = "Team Joined Successfully";

        		$http.post("api/user_has_team", {
                            user_id: $rootScope.userObject.id,
                            team_id: data.id
                        })
                        .success(function(){
                            console.log("User_has_team Updated");
                        })
        	}


        })







	}





}]);