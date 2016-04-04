/**
 * Created by Brandon Banks, Corey Weber, Colin Crowther, & Thomas Doucette on 2016-01-21.
 */

angular.module('dashboard.controllers').controller('searchController', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {

    //Declaring Variables
    $scope.no_users = "No Matching Users";
    $scope.no_teams = "No Matching Teams";
    $rootScope.page_name = "Search";

	//Function for searching database
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

    //Used for displaying the name of the Team's Sport
    $scope.getSport = function(item){
        
        $http.get("/api/sport/" + item.sport_id)
        .success(function(data){
            item.sport_id = data.name;
        })

    }
}]);