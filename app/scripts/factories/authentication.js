'user strict';

(function (app) {
  app.factory('Authentication', [
    '$firebaseSimpleLogin',
    'FBURL',
    factory
  ]);

  function factory($fsl, FBURL) {
    return {
      login: function() {
        
      }
    };
  }
}(drawingApp));
