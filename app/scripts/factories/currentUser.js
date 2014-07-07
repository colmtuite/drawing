'user strict';

(function (app) {
  function CurrentUser(futureData) {
    this.user = new CurrentUser.$model();
    this._resource = new Firebase(CurrentUser.FBURL);
  }

  CurrentUser.$factory = [
    'FBURL',
    'User',
    function(FBURL, User) {
      angular.extend(CurrentUser, {
        FBURL: FBURL,
        $model: User
      });

      return CurrentUser;
  }];

  app.factory('CurrentUser', CurrentUser.$factory);

  angular.extend(CurrentUser.prototype, EventEmitter.prototype, {
    authenticate: function() {
      var that = this;

      new FirebaseSimpleLogin(this._resource, function(error, userData) {
        if (error) {
          console.warn("error logging in the user", error);
        } else if (userData) {
          that.user.$id = userData.id;
          angular.extend(that.user, userData);
          // We have to do this manually in this instance because we're using
          // the User model outside of a collection.
          // All of the user's data is loaded as soon as I construct this Firebase
          // path.
          that.user._resource = new Firebase(CurrentUser.FBURL + 'users/' + userData.id);
          that.user._unwrap();
          that.trigger('login');
        } else {
          // Guest user
        }
      });
    },

    logout: function() {
      this._resource.logout();
    },
  });

  CurrentUser.login = function(email, password) {
    return this._resource.login('password', {
      email: email, password: password
    });
  };

  // CurrentUser.$create = function(email, password) {
  //   return this.$$auth.$createUser(email, password).then(function(user) {
  //     CurrentUser.$UserCollection.$create(user);
  //   });
  // };
  
}(drawingApp));
