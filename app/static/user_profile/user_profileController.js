/**
 * Created by Brandon on 1/20/2016.
 */

angular.module('dashboard.controllers',[]).controller('user_profileController', ['$scope', '$http', function ($scope, $http) {

    console.log("user_profil Page");

    //Initializes the date time picker plugin.
	$('#birth').datetimepicker({
        format: 'MM/DD/YYYY',
        viewMode: 'years'
    });

}]);