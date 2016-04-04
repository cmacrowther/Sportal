/**
 * Created by Brandon Banks, Corey Weber, Colin Crowther, & Thomas Doucette on 2016-01-21.
 *
 * homeController - Controller for home page.
 */

angular.module('dashboard.controllers',[]).controller('HomeController', ['$scope', '$http','$rootScope', function ($scope, $http, $rootScope) {

    $rootScope.page_name = "Home";

    /* Initializes the date time picker plugin. */
    $('#birth').datetimepicker({
        format: 'MM/DD/YYYY',
        viewMode: 'years'
    });

}]);
