/**
 * Created by Brandon on 1/20/2016.
 */

angular.module('dashboard.controllers').controller('channelController', ['$scope', '$rootScope', '$http', '$routeParams', function ($scope, $rootScope, $http, $routeParams) {

    $rootScope.page_name = "Messages";

    $scope.channel_create = false;

    $http.get("/api/user").success(function(data){
        $scope.users = data.objects;
    });

    var passObject = {user_id: $rootScope.userObject.id};

    $http({
        method: 'POST',
        url: 'api/get_user_conversations',
        headers: {'Content-Type': 'application/json'},
        data: JSON.stringify(passObject)
    })
    .success(function(data){
        if (data == "no conversations") {
            $scope.convos = [];
            alert(data);
        }
        else {
            $scope.convos = data;
        }

    });

    $http({
        method: 'POST',
        url: 'api/get_team_channels',
        headers: {'Content-Type': 'application/json'},
        data: JSON.stringify(passObject)
    })
    .success(function(data){
        if (data == "no channels") {
            $scope.channels = [];
            alert(data);
        }
        else {
            $scope.channels = data;
        }

    });

    $scope.setConversation = function(conversation_id){
        var passObject = {conversation_id: conversation_id}

        $http({
            method: 'POST',
            url: 'api/get_conversation_messages',
            headers: {'Content-Type': 'application/json'},
            data: JSON.stringify(passObject)
        })
        .success(function(data){
            console.log("hi");
            $scope.convo_id = conversation_id;
            
            $http.get("api/conversation/" + conversation_id)
            .success(function(data){
                if (data.user_one == $rootScope.userObject.id) {
                    $http.get("/api/user/" + data.user_two)
                    .success(function(data){
                       $scope.title = "Conversation with " + data.first_name + " " + data.last_name; 
                    })   
                }
                else {
                    $http.get("/api/user/" + data.user_one)
                    .success(function(data){
                       $scope.title = "Conversation with " + data.first_name + " " + data.last_name; 
                    }) 
                }
            })

            if (data == "no messages") {
                console.log('');
                $scope.messages = [];
            }
            else {
                $scope.messages = data;
            }
        })
    }

    $scope.createConversation = function (user_id) {
        if (user_id == $rootScope.userObject.id) {
            alert("yourself");
        }
        else {
            var flag = 0; //flag if already in convo with

            angular.forEach($scope.convos, function (value, key) {
                if (value.convo_user_id == user_id) {
                    alert("already in convo with");
                    flag = 1;
                }
            });

            if (flag == 0) {
                // Create Conversation
                $http.post("api/conversation", {
                        user_one: $rootScope.userObject.id,
                        user_two: user_id,
                        time: new Date(),
                        status: 0
                    })
                    .success(function (data) {
                        console.log("Successful Create.");


                        $http.get("api/user/" + user_id)
                            .success(function (user) {

                                var convo = {
                                    id: data.id,
                                    convo_user_id: user.id,
                                    first_name: user.first_name,
                                    last_name: user.last_name,
                                    picture: user.picture
                                }
                                $scope.convos.push(convo);

                                $scope.setConversation(data.id);
                            });
                    });

            }
        }
    }

    $scope.sendMessage = function () {
            console.log($scope.convo_id);
            //Create Message
            $http.post("api/message", {
                    user_id: $rootScope.userObject.id,
                    body: $scope.message,
                    time: new Date()
                })
                .success(function (data) {

                    if($scope.channel_id) {
                        $scope.message = "";
                        $http.post("api/channel_has_message", {
                            channel_id: $scope.channel_id,
                            message_id: data.id
                        })
                        .success(function(data){
                            console.log("Channel Message Sent.");
                        })
                    }
                    else {
                        $scope.message = "";
                        $http.post("api/user_has_message", {
                            user_id: $rootScope.userObject.id,
                            message_id: data.id,
                            is_read: 0,
                            conversation_id: $scope.convo_id
                        })
                        .success(function (uhm) {
                            $scope.setConversation($scope.convo_id);
                        })
                    }
                })

        }

    $scope.setChannel = function(channel_id){

        $http.get("/api/channel/" + channel_id)
        .success(function(data){
            $scope.title = "Channel " + data.name;
        })

        var passObject = {channel_id: channel_id};

        $http({
            method: 'POST',
            url: 'api/get_channel_messages',
            headers: {'Content-Type': 'application/json'},
            data: JSON.stringify(passObject)
        })
        .success(function (data) {

            if (data == "no messages") {
                $scope.messages = [];
            }
            else {
                $scope.messages = data;
            }

        });
    }





}]);