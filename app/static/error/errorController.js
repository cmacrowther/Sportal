angular.module('dashboard.controllers').controller('errorController', ['$scope', '$rootScope', '$http', '$routeParams', function ($scope, $rootScope, $http, $routeParams) {

	$scope.error = $routeParams.error;

}]);