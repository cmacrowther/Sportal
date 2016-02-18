/**
 * Created by Corey Weber on 2016-03-06.
 */
angular.module('dashboard.controllers')
    .controller('ChannelsController', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {

        var passObject = { user_id: $rootScope.userObject.id}

        $http({
            method: 'POST',
            url: 'api/get_user_conversations',
            headers: {'Content-Type': 'application/json'},
            data: JSON.stringify(passObject)
        })
            .success(function (data) {
                if(data== "no conversations"){
                    alert(data);
                }
                else{
                    $scope.convos = data;
                }

            });

    }]);
