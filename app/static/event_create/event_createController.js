/**
 * Created by Brandon on 1/20/2016.
 */
angular.module('dashboard.controllers').controller('event_createController', ['$scope', '$http', '$rootScope', '$routeParams', function ($scope, $http, $rootScope, $routeParams) {

    $('#eventForm').validator();

	$scope.addEvent = function() {

		$http.post("api/event", {
            name: $scope.event_name, 
            date: $scope.event_date, 
            time: $scope.event_time, 
            description: $scope.event_description,
            location: $scope.event_location,
            creator: $rootScope.userObject.id
        })
        .success(function(data){
            console.log("Event added");
            $scope.addEventResult = "Event Created Successfully!"
            $rootScope.events.push(data);

            $http.post("api/event_has_attendee", {
                event_id: data.id,
                user_id: $rootScope.userObject.id
            })
            .success(function(data){
                console.log("attendee added");
            })
        })
	}


}]);