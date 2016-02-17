/**
 * Created by Brandon on 1/20/2016.
 */
angular.module('dashboard.controllers').controller('gamesController', ['$scope', '$http', '$rootScope', '$routeParams', function ($scope, $http, $rootScope, $routeParams) {

	var passObject = {user_id: $rootScope.userObject.id};

	$scope.gamesip = [];
	$scope.past_games = [];
	$scope.no_games_ip = "No Games in Progress";
	$scope.no_past_games = "No Past Games";


	//code here
	$http({
		method: 'POST',
		url: 'api/get_user_games',
		headers: {'Content-Type': 'application/json'},
		data: JSON.stringify(passObject)
	})
    .success(function(data){
    	console.log(data);
    	if(data == "no match"){
    		//do nothing
    	}
    	else {
    		for(var i = 0; i < data.length; i++) {
	    		if (data[i].complete == 1){
	    			$scope.past_games.push(data[i]);
	    			$scope.no_past_games = "";
	    		}
	    		else {
	    			$scope.gamesip.push(data[i]);
	    			$scope.no_games_ip = "";
	    		}
    		}
    	}
    	
    })

    $scope.getSport = function(item){
        
        $http.get("/api/sport/" + item.sport_id)
        .success(function(data){
            item.sport_id = data.name;
        })

    }

    $scope.getUser = function(item){
        
        $http.get("/api/user/" + item.player2_id)
        .success(function(data){
            item.opponent = data.first_name + " " + data.last_name;
        })

    }

}]);