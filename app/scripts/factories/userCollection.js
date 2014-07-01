'use strict';

(function (app) {
  function UserCollection() {}

  UserCollection.$factory = [
    '$firebase',
    'FBURL',
    'User',
    function($firebase, FBURL, User) {
      angular.extend(UserCollection, {
        // This is a base level collection so it needs a direct resource
        // reference.
        $$resource: $firebase(new Firebase(FBURL + 'users')),
        $User: User
      });

      return UserCollection;
    }];

  app.factory('UserCollection', UserCollection.$factory);

  UserCollection.$create = function(attrs) {
    var uid = String(attrs.id);
    // This ensures that the user is created with the same uid as their ID
    // on Firebase. These should be unique so there won't be clashes.
    this.$$resource[uid] = attrs;
    var ref = this.$$resource.$save(uid);
    return new this.$User(ref);
  };

  UserCollection.$find = function(uid) {
    var ref = UserCollection.$$resource.$child(uid);
    return new UserCollection.$User(ref);
  };
})(drawingApp);
