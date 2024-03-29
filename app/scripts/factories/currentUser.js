'user strict';

(function (app) {
  function CurrentUser(futureData) {
    this.user = new CurrentUser.$model();
    this._resource = new Firebase(CurrentUser.FBURL);
  }

  CurrentUser.$factory = [
    'ENV',
    'User',
    function(ENV, User) {
      angular.extend(CurrentUser, {
        FBURL: ENV.firebaseUrl,
        $model: User
      });

      return CurrentUser;
  }];

  app.factory('CurrentUser', CurrentUser.$factory);

  angular.extend(CurrentUser.prototype, EventEmitter.prototype, {
    authenticate: function() {
      var that = this;

      this.auth = new FirebaseSimpleLogin(this._resource, function(error, userData) {
        if (error) {
          console.warn("error logging in the user", error);
        } else if (userData) {
          angular.extend(that.user, userData);
          // We have to do this manually in this instance because we're using
          // the User model outside of a collection.
          // All of the user's data is loaded as soon as I construct this 
          // Firebase path.
          that.user.setRef('users/' + userData.id);
          that.user._unwrap();
          that.trigger('login', [that.user]);
        } else {
          // Guest user
        }
      });
    },

    logout: function() {
      this.auth.logout();
      this.trigger('logout');
    },

    login: function(email, password, success) {
      success || (success = angular.noop);
      var that = this;
      var loginHandler = function() {
        success.apply(that, arguments);
        that.off('login', loginHandler);
      };
      this.on('login', loginHandler);
      this.auth.login('password', { email: email, password: password });
    },

    create: function(email, password, success) {
      success || (success = angular.noop);
      return this.auth.createUser(email, password, success);
    },
  });

  // CurrentUser.$create = function(email, password) {
  //   return this.$$auth.$createUser(email, password).then(function(user) {
  //     CurrentUser.$UserCollection.$create(user);
  //   });
  // };
  
}(drawingApp));
