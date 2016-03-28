/**
 * Created by Brandon on 1/20/2016.
 */

angular.module('dashboard.controllers').controller('channelController', ['$scope', '$rootScope', '$http', '$routeParams', '$timeout', function ($scope, $rootScope, $http, $routeParams, $timeout) {

    //variable declarations
    $rootScope.page_name = "Messages";
    $scope.event_id = "";
    $scope.editable = false;
    $scope.in_convo = false;

    ////////////////////////////////////////////////////////

    //PUSHER INITIALIZATION

    Pusher.log = function (message) {
        if (window.console && window.console.log) {
            window.console.log(message);
        }
    };

    var pusher = new Pusher('56753b214ab2420a7230', {
        encrypted: true
    });

    var channel = pusher.subscribe('unchained');


    ////////////////////////////////////////////////////////

    //checking the URL for new convo/new channel directive
    if ($routeParams.user_id) {
        $http.get("api/user/" + $routeParams.user_id)
        .success(function(data){
            //the user exists
            $scope.createConversation(data.id);
        })
        .error(function(data){
            //the user cannot be found
            $scope.error = "User does Not Exist";
            window.location.assign("dashboard.html#/error/" + $scope.error);
        })
    }
    else if ($routeParams.team1_id && $routeParams.team2_id) {
        $http.get("api/team/" + $routeParams.team1_id)
        .success(function(data){
            $scope.first_team = data;
            $http.get("api/team/" + $routeParams.team2_id)
            .success(function(data){
                $scope.second_team = data;

                var passObject = {team_1: $scope.first_team.id, team_2: $scope.second_team.id};

                $http({
                    method: 'POST',
                    url: 'api/check_for_channel',
                    headers: {'Content-Type': 'application/json'},
                    data: JSON.stringify(passObject)
                })
                .success(function (data) {
                    if (data == "duplicate") {
                        //already exists
                        alert("Channel Already Exists!");
                        window.location.assign("#/messages")
                    }
                    else {
                        $http.post("api/channel", {
                            admin_id: 1,
                            name: $scope.first_team.name + " vs. " + $scope.second_team.name,
                            description: "Null"
                        })
                        .success(function(data){
                            $http.post("api/team_has_channel", {
                                team_id: $scope.first_team.id,
                                channel_id: data.id
                            })
                            .success(function(data){
                                $http.post("api/team_has_channel", {
                                    team_id: $scope.second_team.id,
                                    channel_id: data.channel_id
                                })
                                .success(function(data){
                                    console.log("Total Success.");
                                    $routeParams.team1_id = null;
                                    $routeParams.team2_id = null;
                                    window.location.assign("#/messages");
                                })
                            })
                        })
                    }
                })
            })
        })
    }
    else {
        //regular page load
        //grab the team channels
        var passObject = {user_id: $rootScope.userObject.id};
        $http({
            method: 'POST',
            url: 'api/get_team_channels',
            headers: {'Content-Type': 'application/json'},
            data: JSON.stringify(passObject)
        })
        .success(function (data) {
            if (data == "no channels") {
                $scope.channels = [];
                $scope.no_channels = "No Channels";
            }
            else {
                $scope.channels = data;
                $scope.no_channels = "";
            }

        });
    }

    //gets users for new convo modal
    $http.get("/api/user").success(function (data) {
        $scope.users = data.objects;
    });

    //toggle between delete/regular view
    $scope.editConvos = function () {
        $scope.editable = !$scope.editable;
    };


    //sets title for current conversation, triggered when a direct message is selected
    $scope.setConversation = function (conversation_id) {

        $scope.in_convo = true;

        var passObject = {conversation_id: conversation_id};

        $http({
            method: 'POST',
            url: 'api/get_conversation_messages',
            headers: {'Content-Type': 'application/json'},
            data: JSON.stringify(passObject)
        })
        .success(function (data) {
            $rootScope.convo_id = conversation_id;

            $http.get("api/conversation/" + conversation_id)
                .success(function (data) {
                    if (data.user_one == $rootScope.userObject.id) {
                        $scope.convo_with = data.user_two;
                        $http.get("/api/user/" + data.user_two)
                            .success(function (data) {
                                $scope.title = "Conversation with " + data.first_name + " " + data.last_name;
                            })
                    }
                    else {
                        $scope.convo_with = data.user_one;
                        $http.get("/api/user/" + data.user_one)
                            .success(function (data) {
                                $scope.title = "Conversation with " + data.first_name + " " + data.last_name;
                            })
                    }
                });

            if (data == "no messages") {
                console.log('');
                $scope.messages = [];
            }
            else {
                $scope.messages = data;

            }

        })
    };

    //creates a new convo when triggered from the "new convo" modal
    $scope.createConversation = function (user_id) {
        if (user_id == $rootScope.userObject.id) {
            alert("yourself");
        }
        else {
            var flag = 0; //flag if already in convo with

            angular.forEach($rootScope.convos, function (value, key) {
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
                                };
                                $rootScope.convos.push(convo);
                                $rootScope.no_convos = "";

                                $scope.setConversation(data.id);
                            });
                    });

            }
        }
    };

    //tells angular if the user is currently in a message pane, in a channel/in a direct message convo
    $scope.setMessageType = function (id, item) {
        if (item == "Channel") {
            $scope.event_id = String(id) + "-channel";
            $scope.is_channel = true;
            $scope.is_convo = false;
            console.log($scope.event_id);
        }
        else {
            $scope.event_id = String(id) + "-convo";
            $scope.is_channel = false;
            $scope.is_convo = true;
            console.log($scope.event_id);
        }
        //watch for events on given channel or conversation, push new events to screen
        channel.bind($scope.event_id, function (data) {
            console.log(data);
            $scope.messages.push(data);
        });
    };

    //function used to send message, triggers pusher in back end for sending message and increasing counter
    $scope.sendMessage = function () {

        if ($scope.event_id != undefined) {

            var passObject = {
                event_id: $scope.event_id,
                sender_first_name: $rootScope.userObject.first_name,
                sender_last_name: $rootScope.userObject.last_name,
                picture: $rootScope.userObject.picture,
                time: new Date(),
                message: $scope.message
            };

            $http({
                method: 'POST',
                url: 'api/send_message',
                headers: {'Content-Type': 'application/json'},
                data: JSON.stringify(passObject)
            })
                .success(function (data) {
                    console.log("MESSAGE SENT");

                    var passObject = {recipient_id: $scope.convo_with, convo_id: $rootScope.convo_id};

                    $http({
                        method: 'POST',
                        url: 'api/increase_message_count',
                        headers: {'Content-Type': 'application/json'},
                        data: JSON.stringify(passObject)
                    })
                        .success(function (data) {
                            //Create Message
                            $http.post("api/message", {
                                    user_id: $rootScope.userObject.id,
                                    body: $scope.message,
                                    time: new Date()
                                })
                                .success(function (data) {

                                    //checks if the message is being sent to a channel or to a user
                                    if ($scope.is_channel) {
                                        $scope.message = "";
                                        $http.post("api/channel_has_message", {
                                                channel_id: $scope.channel_id,
                                                message_id: data.id
                                            })
                                            .success(function (data) {
                                                console.log("Channel Message Sent.");
                                            })
                                    }
                                    else {
                                        $scope.message = "";
                                        $http.post("api/user_has_message", {
                                            user_id: $rootScope.userObject.id,
                                            message_id: data.id,
                                            //always set is_read_user_one to true because they are the one who sent the message
                                            is_read_user_one: 1,
                                            conversation_id: $rootScope.convo_id,
                                            //set the person recieving the message to false so they message notification will appear upon login
                                            is_read_user_two: 0
                                        })
                                    }
                                })
                        })
                })
        }
    };

    //sets title for current conversation, triggered when a channel is selected
    $scope.setChannel = function (channel_id) {

        $scope.in_convo = true;

        $scope.channel_id = channel_id;

        $http.get("/api/channel/" + channel_id)
            .success(function (data) {
                $scope.title = "Channel " + data.name;
            });

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
    };

    //sets item for the delete convo modal
    $scope.setModal = function (item) {
        $scope.modalObject = item;
    };

    //function used only to delete direct message conversations
    $scope.deleteConvo = function () {

        var passObject = {conversation_id: $scope.modalObject.id};

        $http({
            method: 'POST',
            url: 'api/get_conversation_messages',
            headers: {'Content-Type': 'application/json'},
            data: JSON.stringify(passObject)
        })
            .success(function (data) {
                if(data == "no messages") {
                    $http.delete("/api/conversation/" + $scope.modalObject.id);
                    $rootScope.convos.splice($scope.modalObject.id, 1);
                }
                else {
                    for (var i = 0; i < data.length; i++) {
                        $http.delete("/api/user_has_message/" + data[i].uhm_id);
                        $http.delete("/api/message/" + data[i].id);
                    }
                }
                
                if ($rootScope.convos == []) {
                    $rootScope.no_convos = "No Conversations";
                }
            })
    };

    //function used to change read tags when convo is selected
    $scope.is_read_message = function (item) {

        var passObject = {conversation_id: item};

        $http({
            method: 'POST',
            url: 'api/get_conversation_messages',
            headers: {'Content-Type': 'application/json'},
            data: JSON.stringify(passObject)
        })
            .success(function (data) {

                for (var i = 0; i < data.length; i++) {
                    if (data[i].user_id != $rootScope.userObject.id && data[i].is_read_user_two == 0) {
                        //they didnt send the message and its unread, therefore is_read_user_two needs to change to READ
                        var is_read = {
                            id: data[i].uhm_id,
                            user_id: $scope.convo_with,
                            is_read_user_one: 1,
                            conversation_id: item,
                            is_read_user_two: 1
                        };
                        $http.put("/api/user_has_message/" + is_read.id, is_read);

                        //does not decrease counter if already 0
                        if($rootScope.message_counter != 0) {
                            $rootScope.message_counter -= 1;
                        }
                    }
                }

            })

    };

}]);