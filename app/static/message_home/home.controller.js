/**
 * Created by Corey Weber on 2016-02-18.
 */
/**
 * Created by Corey Weber on 2016-03-06.
 */
angular.module('dashboard.controllers')
.controller('AuthCtrl', function(Auth, $state, $rootScope){
    var authCtrl = this;

    authCtrl.user = {
      email: '',
      password: ''
    }


    authCtrl.login = function() {
      Auth.$authWithPassword(authCtrl.user).then(function(auth){
        $state.go('home');
      }, function(error){
        authCtrl.error = error;
      });
    };

    authCtrl.register = function() {
        Auth.$createUser(authCtrl.user).then(function(user){
          authCtrl.login();
        }, function(error){
          authCtrl.error = error;
        });
      };
});
