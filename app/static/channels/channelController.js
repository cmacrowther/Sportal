/**
 * Created by Brandon on 1/20/2016.
 */

angular.module('dashboard.controllers').controller('channelController', ['$scope', '$rootScope', '$http', '$routeParams', '$timeout', function ($scope, $rootScope, $http, $routeParams, $timeout) {

    $rootScope.page_name = "Messages";
    $scope.is_channel = false;
    $scope.in_convo = false;

    $http.get("/api/user").success(function(data){
        $scope.users = data.objects;
    });

    var passObject = {user_id: $rootScope.userObject.id};

    $http({
        method: 'POST',
        url: 'api/get_team_channels',
        headers: {'Content-Type': 'application/json'},
        data: JSON.stringify(passObject)
    })
    .success(function(data){
        if (data == "no channels") {
            $scope.channels = [];
            $scope.no_channels = "No Channels";
        }
        else {
            $scope.channels = data;
            $scope.no_channels= "";
        }

    });

    //sets title for current conversation, triggered when a direct message is selected
    $scope.setConversation = function(conversation_id){
        var passObject = {conversation_id: conversation_id}

        $http({
            method: 'POST',
            url: 'api/get_conversation_messages',
            headers: {'Content-Type': 'application/json'},
            data: JSON.stringify(passObject)
        })
        .success(function(data){
            $scope.convo_id = conversation_id;
            
            $http.get("api/conversation/" + conversation_id)
            .success(function(data){
                if (data.user_one == $rootScope.userObject.id) {
                    $scope.convo_with = data.user_two;
                    $http.get("/api/user/" + data.user_two)
                    .success(function(data){
                        $scope.title = "Conversation with " + data.first_name + " " + data.last_name; 
                    })   
                }
                else {
                    $scope.convo_with = data.user_one;
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

    //creates a new convo when triggered from the "new convo" modal
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
                                $rootScope.no_convos = "";

                                $scope.setConversation(data.id);
                            });
                    });

            }
        }
    }

    //tells angular if the user is currently in a message pane, in a channel/in a direct message convo
    $scope.setMessageType = function (item) {
        if(item == "Channel") {
            $scope.is_channel = true;
            $scope.is_convo = false;
            $scope.in_convo = true;
        }
        else {
            $scope.is_channel = false;
            $scope.is_convo = true;
            $scope.in_convo = true;
        }
    }

    $scope.sendMessage = function () {
            //Create Message
            $http.post("api/message", {
                    user_id: $rootScope.userObject.id,
                    body: $scope.message,
                    time: new Date()
                })
                .success(function (data) {

                    //checks if the message is being sent to a channel or to a user
                    if($scope.is_channel) {
                        $scope.message = "";
                        $http.post("api/channel_has_message", {
                            channel_id: $scope.channel_id,
                            message_id: data.id
                        })
                        .success(function(data){
                            console.log("Channel Message Sent.");
                            $scope.setChannel($scope.channel_id);
                        })
                    }
                    else {
                        $scope.message = "";
                        $http.post("api/user_has_message", {
                            user_id: $rootScope.userObject.id,
                            message_id: data.id,
                            //always set is_read_user_one to true because they are the one who sent the message
                            is_read_user_one: 1,
                            conversation_id: $scope.convo_id,
                            //set the person recieving the message to false so they message notification will appear upon login
                            is_read_user_two: 0
                        })
                        $scope.setConversation($scope.convo_id);
                    }
                })

        }

    //sets title for current conversation, triggered when a channel is selected
    $scope.setChannel = function(channel_id){

        $scope.channel_id = channel_id;

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

    //sets item for the delete convo modal
    $scope.setModal = function (item) {
        $scope.modalObject = item;
    };

    //function used only to delete direct message conversations
    $scope.deleteConvo = function () {

        var passObject = {conversation_id: $scope.modalObject.id}

        $http({
            method: 'POST',
            url: 'api/get_conversation_messages',
            headers: {'Content-Type': 'application/json'},
            data: JSON.stringify(passObject)
        })
        .success(function(data){
            for(var i = 0; i < data.length; i++) {
                $http.delete("/api/user_has_message/" + data[i].uhm_id);
                $http.delete("/api/message/" + data[i].id);
            }
            $http.delete("/api/conversation/" + $scope.modalObject.id);
            $scope.convos.splice($scope.modalObject.id, 1);
            if($scope.convos == []) {
                $rootScope.no_convos = "No Conversations";
            }
        })
    }

    //checks every 5 seconds for messages
    $scope.updateMessages = function () {

        $timeout(function () {
            //checks if angular needs to pull channel messages or direct message convo
            if($scope.is_channel) {
                console.log("CHANNEL MESSAGE CHECK");

                var passObject = {channel_id: $scope.channel_id};

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

                })
            }
            if ($scope.is_convo) {
                console.log("MESSAGE CHECK");

                var passObject = {conversation_id: $scope.convo_id};
                $http({
                    method: 'POST',
                    url: 'api/get_conversation_messages',
                    headers: {'Content-Type': 'application/json'},
                    data: JSON.stringify(passObject)
                })
                .success(function(data){

                    if (data == "no messages") {
                        $scope.messages = [];
                    }
                    else {
                        $scope.messages = data;
                    }

                })
            }
            $scope.updateMessages();
        }, 5000)
    }

    //Initial Call to update messages
    $scope.updateMessages();

    $scope.is_read_message = function (item) {
        
        var passObject = {conversation_id: item};

        $http({
            method: 'POST',
            url: 'api/get_conversation_messages',
            headers: {'Content-Type': 'application/json'},
            data: JSON.stringify(passObject)
        })
        .success(function(data){

            for(var i = 0; i < data.length; i++) {
                if(data[i].user_id != $rootScope.userObject.id) {
                    //they didnt sent the message, therefore is_read_user_two needs to change to READ
                    var is_read = {
                        id: data[i].uhm_id,
                        user_id: $scope.convo_with,
                        is_read_user_one: 1,
                        conversation_id: item,
                        is_read_user_two: 1,
                    }
                    $http.put("/api/user_has_message/" + is_read.id, is_read);
                }
            }

        })

    }
    


}]);