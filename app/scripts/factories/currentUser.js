'user strict';

(function (app) {
  function CurrentUser(futureData) {
    this.user = new CurrentUser.$User();
  }

  CurrentUser.$factory = [
    '$firebaseSimpleLogin',
    'FBURL',
    'UserCollection',
    'User',
    'ScreenCollection',
    function($fsl, FBURL, UserCollection, User, ScreenCollection) {
      angular.extend(CurrentUser, {
        _resource: $fsl(new Firebase(FBURL)),
        $UserCollection: UserCollection,
        $ScreenCollection: ScreenCollection,
        $User: User
      });

      return CurrentUser;
  }];

  app.factory('CurrentUser', CurrentUser.$factory);

  CurrentUser.login = function(email, password) {
    return this._resource.$login('password', {
      email: email, password: password
    });
  };

  // CurrentUser.$authenticate = function() {
  //   return new this.$User(this.$$auth.$getCurrentUser());
  // };

  // CurrentUser.$create = function(email, password) {
  //   return this.$$auth.$createUser(email, password).then(function(user) {
  //     CurrentUser.$UserCollection.$create(user);
  //   });
  // };

  // CurrentUser.$logout = function() {
  //   this.$$auth.$logout();
  // };
  
}(drawingApp));
