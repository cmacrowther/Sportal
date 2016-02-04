angular.module('dashboard.controllers').controller('searchController', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {


	//function for searching database
	$scope.search = function() {

		var passObject = {searchTerm: $scope.searchTerm};

		$http({
    		method: 'POST',
    		url: 'api/user_search',
    		headers: {'Content-Type': 'application/json'},
    		data: JSON.stringify(passObject)
	    })
    	.success(function(data){
            console.log(data);
            if (data == "no matching users") {
                $rootScope.users_list = [];
            }
            else {
                $rootScope.users_list = data;
            }
        })

        $http({
    		method: 'POST',
    		url: 'api/team_search',
    		headers: {'Content-Type': 'application/json'},
    		data: JSON.stringify(passObject)
	    })
    	.success(function(data){
            console.log(data);
            if (data == "no matching teams") {
                $rootScope.teams_list = [];
            }
            else {
                $rootScope.teams_list = data;
            }
        })

	}

	$scope.displayTeamSport = function(item) {
		
		$http.get("/api/sport/" + item)
            .success(function(data){
                return data.name;
            })
            .error(function(data){
                console.log("Error getting sport.");
            })
	}


}]);