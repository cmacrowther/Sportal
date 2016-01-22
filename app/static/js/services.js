/**
 * Created by Corey on 11/26/2015.
 */
angular.module('dashboard.services', [])
    .factory('service', function ($http, $scope, $rootScope) {
        var serviceObject = {
            getUser: function () {
                return "success";
            },
            setUser: function () {
                return "Success";
            }

        }
        return serviceObject;
    });