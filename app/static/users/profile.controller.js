/**
 * Created by Corey Weber on 2016-03-06.
 */
angular.module('dashboard.controllers')
.controller('ProfileCtrl', function(auth, $state, md5, profile){
    var profileCtrl = this;

    profileCtrl.profile = profile;

    profileCtrl.updateProfile = function() {
      profileCtrl.profile.emailHash = md5.createHash(auth.password.email);
      profileCtrl.profile.$save().then(function(){
        $state.go('channels');
      })
    };
});
