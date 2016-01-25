/**
 * Created by Brandon on 1/21/2016.
 */
angular.module('dashboard.controllers').controller('playController', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {

    console.log("Play Page");


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
            $scope.sports = data.objects;
        })

    $scope.setSport = function(item){
        $scope.sport = item;
        $scope.pickSport = $scope.sport.name;
    }

    $scope.setTier = function(item){
        $scope.pickTier = item;
    }

    $scope.setTeams = function(item){
        $scope.pickTeams = item;
    }

    $scope.play = function(item){

    }
}]);