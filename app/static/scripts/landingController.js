/**
 * Created by Brandon Banks, Corey Weber, Colin Crowther, & Thomas Doucette on 2016-01-21.
 *
 * landingController - Handles registration of a new user to the site as well as authenticating
 * & logging into the site.
 */

angular.module('example.controllers', []).controller('LandingController', ['$scope', '$http', function ($scope, $http) {

    //Initializes the validator plugin
    $('#registerForm').validator();

    var is_error = false;

    /* Registers a new user with error handling & validation checks */
    $scope.register = function () {

        is_error = false;
        $scope.first_name_error = "";
        $scope.last_name_error = "";
        $scope.email_error = "";
        $scope.password_error = "";
        $scope.pw_confirm_error = "";
        $scope.match_error = "";
        $scope.email_exist_error = "";

        //checking empty fields
        if ($scope.first_name == undefined || $scope.first_name == "") {
            console.log("Please Enter First Name *");
            $scope.first_name_error = "Please Enter First Name *";
            is_error = true;
        }

        if ($scope.last_name == undefined || $scope.last_name == "") {
            console.log("Please Enter Last Name *");
            $scope.last_name_error = "Please Enter Last Name *";
            is_error = true;
        }

        if ($scope.email == undefined || $scope.email == "") {
            console.log("Please Enter Valid Email *");
            $scope.email_error = "Please Enter Valid Email *";
            is_error = true;
        }
        else {
            var email = $scope.email;
            //todo check for period after @ sign
            var result = email.match(/\w*\@\w*\\\.\w*/gi);
            console.log(result);
        }

        if ($scope.password == undefined || $scope.password == "") {
            console.log("Please Enter Password *");
            $scope.password_error = "Please Enter Password *";
            is_error = true;
        }
        else {
            //Check password strength (length of pass)
            var password = $scope.password;
            if (password.length < 8) {
                console.log("Password too weak");
                $scope.pw_length_error = "Password must be at least 8 characters *"
            }
        }

        if ($scope.pw_confirm == undefined || $scope.pw_confirm == "") {
            console.log("Please Confirm Password *");
            $scope.pw_confirm_error = "Please Confirm Password *";
            is_error = true;
        }

        //check if password & passwordConfirm inputs match
        if ($scope.password != $scope.pw_confirm) {
            console.log("Passwords Do Not Match");
            $scope.match_error = "Passwords Do Not Match *";
            is_error = true;
        }

        if (is_error) {
            console.log("Error");
        }
        else {
            var passObject = {email: $scope.email};
            //Check if email already taken by currently registered user
            $http({
                method: 'POST',
                url: 'api/email_check',
                headers: {'Content-Type': 'application/json'},
                data: JSON.stringify(passObject)
            }).success(function (data) {
                if (data == "duplicate") {
                    console.log("Email Already Exists");
                    $scope.email_exists_error = "Email Already Exists *";
                }
                else {
                    console.log("No duplicate");
                    console.log("Registration Successful");

                    /* Generate a default profile image based on users initials */
                    var colours = ["#1abc9c", "#2ecc71", "#3498db", "#9b59b6", "#34495e", "#16a085", "#27ae60", "#2980b9", "#8e44ad", "#2c3e50", "#f1c40f", "#e67e22", "#e74c3c", "#95a5a6", "#f39c12", "#d35400", "#c0392b", "#bdc3c7", "#7f8c8d"];

                    var name = $scope.first_name + " " + $scope.last_name,
                        nameSplit = name.split(" "),
                        initials = nameSplit[0].charAt(0).toUpperCase() + nameSplit[1].charAt(0).toUpperCase();

                    var charIndex = initials.charCodeAt(0) - 65,
                        colourIndex = charIndex % 19;

                    var canvas = document.getElementById("user-icon");
                    var context = canvas.getContext("2d");

                    var canvasWidth = $(canvas).attr("width"),
                        canvasHeight = $(canvas).attr("height"),
                        canvasCssWidth = canvasWidth,
                        canvasCssHeight = canvasHeight;

                    if (window.devicePixelRatio) {
                        $(canvas).attr("width", canvasWidth * window.devicePixelRatio);
                        $(canvas).attr("height", canvasHeight * window.devicePixelRatio);
                        $(canvas).css("width", canvasCssWidth);
                        $(canvas).css("height", canvasCssHeight);
                        context.scale(window.devicePixelRatio, window.devicePixelRatio);
                    }

                    context.fillStyle = colours[colourIndex];
                    context.fillRect (0, 0, canvas.width, canvas.height);
                    context.font = "64px Arial";
                    context.textAlign = "center";
                    context.fillStyle = "#FFF";
                    context.fillText(initials, canvasCssWidth / 2, canvasCssHeight / 1.75);

                    var dataURL = canvas.toDataURL();

                    //Register the user
                    $http.post("api/user", {
                        team_id: 0,
                        first_name: $scope.first_name,
                        last_name: $scope.last_name,
                        email: $scope.email,
                        password: $scope.password,
                        description: "",
                        picture: dataURL
                    }).success(function (data) {
                        console.log("Successful Register");
                        localStorage.setItem("id", data.id);
                        window.location.assign("/dashboard.html");
                    })
                }
            })
        }
    };

    /* Logs you in and stores userObject info to localstorage */
    $scope.login = function () {
        var passObject = {email: $scope.loginEmail, password: $scope.loginPassword};

        //Sign In
        $http({
            method: 'POST',
            url: 'api/sign_in',
            headers: {'Content-Type': 'application/json'},
            data: JSON.stringify(passObject)
        }).success(function (data) {
            if (data == "Password Incorrect") {
                console.log("Password Incorrect");
                alert("Password Incorrect")
            }
            else if (data == "No User with that email") {
                console.log("No User with that email");
                alert("No User With That Email");
            }
            else {
                console.log("User id: " + data);
                console.log("Login Successful");
                localStorage.setItem("id", data);
                window.location.assign("/dashboard.html");
            }
        })
    };

}]);