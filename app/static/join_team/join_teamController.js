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
                
                var passObject = {url: $scope.team_name, user_id: $rootScope.userObject.id}

                $http({
                    method: 'POST',
                    url: 'api/team_member_check',
                    headers: {'Content-Type': 'application/json'},
                    data: JSON.stringify(passObject)
                })
                .success(function(data){ 
                    
                    if (data == "duplicate"){
                        console.log("already a member");
                        $scope.team_name_dne_error = "Already a Member";
                    }
                    else {
                        console.log("Joining team... " + data);
                        $scope.join_team_id = data;
                        $http.post("api/user_has_team", {
                            user_id: $rootScope.userObject.id,
                            team_id: data
                        })
                        .success(function(){
                            console.log("User_has_team Updated");
                            console.log("Team Joined Successfully");
                            $scope.joinTeamResult = "Team Joined Successfully";
                            $http.get("/api/team/" + $scope.join_team_id)
                            .success(function (data) {
                                $rootScope.teams.push(data);
                            })
                        })

                    }
                })

        	}


        })


	}


}]);