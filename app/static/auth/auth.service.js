/**
 * Created by Corey Weber on 2016-03-06.
 */
angular.module('dashboard.controllers')
.factory('Auth', function($firebaseAuth, FirebaseUrl){
  var ref = new Firebase(FirebaseUrl);
  var auth = $firebaseAuth(ref);

  return auth;
})
