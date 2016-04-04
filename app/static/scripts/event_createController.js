/**
 * Created by Brandon Banks, Corey Weber, Colin Crowther, & Thomas Doucette on 2016-01-21.
 *
 * event_createController - Allows the creating of sporting events for users to get
 * notified of if they are nearby to its location.
 */

angular.module('dashboard.controllers').controller('event_createController', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {

    /* Location Picker */
    $('#location').locationpicker({
        location: {latitude: 46.15242437752303, longitude: 2.7470703125},
        radius: 300,
        inputBinding: {
            locationNameInput: $('#location-address')
        },
        enableAutocomplete: true,
        onchanged: function (currentLocation, radius, isMarkerDropped) {
            console.log("Location Changed");
            $scope.event_location_lat = currentLocation.latitude;
            $scope.event_location_long = currentLocation.longitude;
        }
    });

    $rootScope.page_name = "Create Event";

    /* Adds an event */
    $scope.addEvent = function () {
        $http.post("api/event", {
            name: $scope.event_name,
            date: $scope.event_date,
            time: $scope.event_time,
            description: $scope.event_description,
            location_address: $scope.event_location,
            location_lat: $scope.event_location_lat,
            location_long: $scope.event_location_long,
            creator: $rootScope.userObject.id
        }).success(function (data) {
            console.log("Event added");
            $scope.addEventResult = "Event Created Successfully!";
            $rootScope.events.push(data);

            $http.post("api/event_has_attendee", {
                event_id: data.id,
                user_id: $rootScope.userObject.id
            }).success(function (data) {
                console.log("attendee added");
            })
        })
    };
}]);