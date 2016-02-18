/**
 * Created by Corey Weber on 2016-03-06.
 */
angular.module('dashboard.controllers')
  .controller('MessagesCtrl', function(profile, channelName, messages){
    var messagesCtrl = this;

    messagesCtrl.messages = messages;
    messagesCtrl.channelName = channelName;

    messagesCtrl.message = '';

    messagesCtrl.sendMessage = function(){
      if(messagesCtrl.message.length > 0){
        messagesCtrl.messages.$add({
          uid: profile.$id,
          body: messagesCtrl.message,
          timestamp: Firebase.ServerValue.TIMESTAMP
        }).then(function(){
          messagesCtrl.message = '';
        });
      }
    }
  });
