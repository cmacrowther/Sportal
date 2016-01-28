/**
 * Created by Brandon on 1/20/2016.
 */
angular.module('dashboard.controllers').controller('team_profileController', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {

    //initializes bootstrap validator
    $("#inviteForm").validator();

    console.log("team_profile Page");

    var passObject = {user_id: $rootScope.userObject.id}

    $scope.sendMail = function() {

        console.log($rootScope.userObject.first_name);
        console.log($scope.email);
        console.log($scope.team_name);        
        console.log($scope.team_password);

        passObject = {user: $rootScope.userObject.first_name, email: $scope.email, team: $scope.team_name, password: $scope.team_password};

        $http({
            method: 'POST',
            url: 'api/send_mail',
            headers: {'Content-Type': 'application/json'},
            data: JSON.stringify(passObject)
        })
        .success(function(data){
            console.log("Success");
            if (data == "Successfully sent"){
                $scope.sendMessageResult = "Message Sent Successfully";
                console.log("Message Sent Successfully");
            }
            else {
                console.log("Error Sending Mail");
            }
        })
    }

    $('#inviteForm').validator().on('submit', function (e) {
        if (e.isDefaultPrevented()) {
            console.log("Form Error");
        } else {
            //check for team and password
            
            $scope.sendMail();
        }
    })

}]);