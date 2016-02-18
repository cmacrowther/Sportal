/**
 * Created by Corey Weber on 2016-03-06.
 */
angular.module('dashboard.controllers')
  .factory('Channels', function($firebaseArray, FirebaseUrl){
    var ref = new Firebase(FirebaseUrl+'channels');
    var channels = $firebaseArray(ref);

    return channels;
  });
