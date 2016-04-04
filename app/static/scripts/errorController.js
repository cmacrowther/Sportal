/**
 * Created by Brandon Banks, Corey Weber, Colin Crowther, & Thomas Doucette on 2016-01-21.
 *
 * errorController - Displays an error page with the error message.
 */

angular.module('dashboard.controllers').controller('errorController', ['$scope', '$rootScope', '$http', '$routeParams', function ($scope, $rootScope, $http, $routeParams) {

	$scope.error = $routeParams.error;

}]);