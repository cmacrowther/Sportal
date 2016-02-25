/**
 * Created by Brandon on 1/20/2016.
 */
angular.module('dashboard.controllers').controller('eventsController', ['$scope', '$http', '$rootScope', '$routeParams', function ($scope, $http, $rootScope, $routeParams) {

    var passObject = {url: $routeParams.url};

    $http({
        method: 'POST',
        url: 'api/get_event_info',
        headers: {'Content-Type': 'application/json'},
        data: JSON.stringify(passObject)
    })
    .success(function(data){

        $scope.eventObject = data[0];

        if ($scope.eventObject.name == "" || $scope.eventObject.name == undefined) {
            $scope.event_name = "No info given";
        }
        else {
            $scope.event_name = $scope.eventObject.name;
            $rootScope.page_name = $scope.eventObject.name;
        }
        if ($scope.eventObject.date == "" || $scope.eventObject.date == undefined) {
            $scope.event_date = "No info given";
        }
        else {
            $scope.event_date = $scope.eventObject.date;
        }
        if ($scope.eventObject.time == "" || $scope.eventObject.time == undefined) {
            $scope.event_time = "No info given";
        }
        else {
            $scope.event_time = $scope.eventObject.time;
        }
        if ($scope.eventObject.address == "" || $scope.eventObject.address == undefined) {
            $scope.event_location = "No info given";
        }
        else {
            $scope.event_location_address = $scope.eventObject.address;
        }
        if ($scope.eventObject.latitude == "" || $scope.eventObject.latitude == undefined) {
            $scope.event_location_latitude = "";
        }
        else {
            $scope.event_location_latitude = $scope.eventObject.latitude;
        }
        if ($scope.eventObject.longitude == "" || $scope.eventObject.longitude == undefined) {
            $scope.event_location_longitude = "";
        }
        else {
            $scope.event_location_longitude = $scope.eventObject.longitude;
        }
        $('#location').locationpicker({
            location: {latitude: $scope.event_location_latitude, longitude: $scope.event_location_longitude},   
            radius: 300
        })
        if ($scope.eventObject.description == "" || $scope.eventObject.description == undefined) {
            $scope.event_description = "No info given";
        }
        else {
            $scope.event_description = $scope.eventObject.description;
        }
        if ($scope.eventObject.creator == "" || $scope.eventObject.creator == undefined) {
            $scope.event_creator = "No info given";
        }
        else {
            $http.get("/api/user/" + $scope.eventObject.creator)
            .success(function(data){
                $scope.event_creator = data.first_name + " " + data.last_name;
            })
        }

        $rootScope.attendees = [];

        passObject = {event_id: $scope.eventObject.id}

        $http({
            method: 'POST',
            url: 'api/get_event_attendees',
            headers: {'Content-Type': 'application/json'},
            data: JSON.stringify(passObject)
        })
        .success(function(data){
            console.log(data);
            if (data == "no people attending") {
                $rootScope.attendees = [];
                $scope.no_attendees = "No Users Attending This Event";
            }
            else {
                $rootScope.attendees = data;
                $scope.no_attendees = "";
            }
        })

    })

    $scope.followEvent = function() {

        var passObject = {event_id: $scope.eventObject.id, user_id: $rootScope.userObject.id};

        $http({
            method: 'POST',
            url: 'api/check_follow_status',
            headers: {'Content-Type': 'application/json'},
            data: JSON.stringify(passObject)
        })
        .success(function(data){
            if (data == "noduplicate") {
                $http.post("api/event_has_attendee", {
                    event_id: $scope.eventObject.id,
                    user_id: $rootScope.userObject.id
                })
                .success(function(data){
                    $rootScope.attendees.push($rootScope.userObject);
                    $http.get("/api/event/" + $scope.eventObject.id)
                    .success(function(data){
                        $rootScope.events.push(data);
                    })
                })
            }
            else {
                alert("You are already following this event you!");
            }
        })
    }

    $scope.deleteEvent = function() {

        var passObject = {event_id: $scope.eventObject.id};

        $http.delete("/api/event/" + $scope.eventObject.id)
        .success(function(){
            $http({
                method: 'POST',
                url: 'api/get_event_attendees',
                headers: {'Content-Type': 'application/json'},
                data: JSON.stringify(passObject)
            })
            .success(function(data){
                for(var i = 0; i<data.length; i++){
                    $http.delete("/api/event_has_attendee/" + data[i].id)
                    .success(function(){
                        console.log("Attendee " + i + " deleted.");
                    })
                }
                window.location.assign("#/home");
            })
        })
    }

}]);