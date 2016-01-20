/**
 * Created by Corey Weber on 2016-01-11.
 */
angular.module('example.controllers',[]).controller('LandingController', ['$scope', '$http', function ($scope, $http) {
    console.log("UNCHAINED");
    console.log($scope.first_name);
    console.log($scope.last_name);
    console.log($scope.email);
    console.log($scope.password);
    console.log($scope.pw_confirm);

    var is_error = false;

    $scope.register = function() {
    	console.log($scope.first_name);
    	console.log($scope.last_name);
	    console.log($scope.email);
	    console.log($scope.password);
	    console.log($scope.pw_confirm);

	    is_error = false;
	    $scope.first_name_error = "";
	    $scope.last_name_error = "";
	    $scope.email_error = "";
	    $scope.password_error = "";
	    $scope.pw_confirm_error = "";
	    $scope.match_error = "";

	    //checking empty fields
		if ($scope.first_name == undefined || $scope.first_name == ""){
	    	console.log("Please Enter First Name *");
	    	$scope.first_name_error = "Please Enter First Name *";
	    	is_error = true;
	    }

	    if ($scope.last_name == undefined || $scope.last_name == ""){
	    	console.log("Please Enter Last Name *");
	    	$scope.last_name_error = "Please Enter Last Name *";
	    	is_error = true;
	    }

	    if ($scope.email == undefined || $scope.email == ""){
	    	console.log("Please Enter Valid Email *");
	    	$scope.email_error = "Please Enter Valid Email *";
	    	is_error = true;
	    }
	    else {
	    	console.log("Were in");
	    	var email = $scope.email;
	    	//fix this fucking shit 
	    	var result = email.match(/\w*\@\w*\\\.\w*/gi);
	    	console.log(result);
	    }

	    if ($scope.password == undefined || $scope.password == ""){
	    	console.log("Please Enter Password *");
	    	$scope.password_error = "Please Enter Password *";
	    	is_error = true;
	    }

	    if ($scope.pw_confirm == undefined || $scope.pw_confirm == ""){
	    	console.log("Please Confirm Password *");
	    	$scope.pw_confirm_error = "Please Confirm Password *";
	    	is_error = true;
	    }

	    //checking if passwords match
	    if ($scope.password != $scope.pw_confirm){
	    	console.log("Passwords Do Not Match")
	    	$scope.match_error = "Passwords Do Not Match *";
	    	is_error = true;
	    }

	    if (is_error){
	    	console.log("Error");
	    }
	    else{
	    	console.log("Registration Successful");
	    	//sending the shit to the database
	    	$http.post("api/user", {
	    		team_id: 0,
	    		first_name: $scope.first_name,
	    		last_name: $scope.last_name,
	    		email: $scope.email,
	    		password: $scope.password,
	    		description: "",
	    		picture: ""
	    	})
	    	.success(function(data){
	    		console.log("Successful Register");
	    	})
	    }

    }

}]);