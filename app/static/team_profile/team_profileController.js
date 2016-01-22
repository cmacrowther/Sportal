/**
 * Created by Brandon on 1/20/2016.
 */
angular.module('dashboard.controllers').controller('team_profileController', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {

    console.log("team_profile Page");

    var passObject = {user_id: $rootScope.userObject.id}

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

}]);