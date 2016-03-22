angular.module('dashboard.controllers').controller('pusherTestController', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {

	//lets get pusher yAYYYYY

	$scope.items = [];
	$scope.test_message = "Default";

	Pusher.log = function(message) {
      if (window.console && window.console.log) {
        window.console.log(message);
      }
    };

    var pusher = new Pusher('56753b214ab2420a7230', {
      encrypted: true
    });

    var channel = pusher.subscribe('test_channel');
    channel.bind('hi', function(data) {
       $scope.items.push(data.message);
    });

    //sets the event_id to listen for
    $scope.setMessageType = function (id, item) {
    	if (item == "channel") {
    		$scope.event_id = id + "-channel";
    		console.log($scope.event_id);
    	}
    	else {
    		$scope.event_id = id + "-convo";
    		console.log($scope.event_id);
    	}
    }

    $scope.sendMessage = function (item) {
    	
    	if($scope.event_id != undefined){
    		var passObject = {event_id: $scope.event_id, message: item};

	    	$http({
	            method: 'POST',
	            url: 'api/send_message',
	            headers: {'Content-Type': 'application/json'},
	            data: JSON.stringify(passObject)
	        })
	        .success(function (data) {
	        	console.log("MESSAGE SENT");
	        })
    	}
    	
    }


}]);