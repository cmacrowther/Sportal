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
        
        $scope.result = [];

        console.log("function");

        for(var i = 0 ; i < $rootScope.teams_list.length ; i++){
            if(item.id === $rootScope.teams_list[i].id){
                console.log("in");
                $http.get("/api/sport/" + $rootScope.teams_list[i].sport_id)
                .success(function(data){
                    console.log(data);
                    $scope.sport_name = data.name;
                    return $scope.sport_name;
                })

            }
        }

    }


}]);