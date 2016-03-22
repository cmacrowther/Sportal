angular.module('dashboard.controllers').controller('searchController', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {

    $scope.no_users = "No Matching Users";
    $scope.no_teams = "No Matching Teams";


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
                $scope.no_users = "No Matching Users";
            }
            else {
                $rootScope.users_list = data;
                $scope.no_users = "";
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
                $scope.no_teams = "No Matching Teams";
            }
            else {
                $rootScope.teams_list = data;
                $scope.no_teams = "";
            }
        })
	}

    $scope.getSport = function(item){
        
        $http.get("/api/sport/" + item.sport_id)
        .success(function(data){
            item.sport_id = data.name;
        })

    }

    /*$scope.getCreator = function(item) {

        $http.get("/api/user/" + item.creator)
        .success(function(data){
            item.creator = data.first_name + " " + data.last_name;
        })
    }*/


}]);