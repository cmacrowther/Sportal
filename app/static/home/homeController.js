/**
 * Created by Corey Weber on 2016-01-11.
 */
angular.module('dashboard.controllers',[]).controller('HomeController', ['$scope', '$http','$rootScope', function ($scope, $http, $rootScope) {

    //Initializes the date time picker plugin.
    $('#birth').datetimepicker({
        format: 'MM/DD/YYYY',
        viewMode: 'years'
    });

}]);
