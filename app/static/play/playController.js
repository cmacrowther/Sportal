/**
 * Created by Brandon on 1/21/2016.
 */
angular.module('dashboard.controllers').controller('playController', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {

    console.log("Play Page");

    $http.get("/api/user/" + localStorage.getItem("id"))
        .success(function (data) {
            $rootScope.userObject = data;

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
        })


}]);