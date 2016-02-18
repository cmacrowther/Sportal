/**
 * Created by Corey Weber on 2016-03-06.
 */
angular.module('dashboard.controllers')
  .controller('ChannelsCtrl', function () {
    var channelsCtrl = this;

    Users.setOnline(profile.$id);

    channelsCtrl.profile = profile;
    channelsCtrl.channels = channels;
    channelsCtrl.users = Users.all;

    channelsCtrl.getDisplayName = Users.getDisplayName;
    channelsCtrl.getGravatar = Users.getGravatar;


    channelsCtrl.logout = function () {
      channelsCtrl.profile.online = null;
      channelsCtrl.profile.$save().then(function() {
        Auth.$unauth();
        $state.go('home');
      });
    }

    channelsCtrl.newChannel = {
      name: ''
    };

    channelsCtrl.createChannel = function () {
      channelsCtrl.channels.$add(channelsCtrl.newChannel).then(function(ref){
        $state.go('channels.messages', {channelId: ref.key()})
      })
    }
  });
