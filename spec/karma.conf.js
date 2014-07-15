// Karma configuration
// Generated on Mon Jul 07 2014 16:51:05 GMT+0100 (IST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '..',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine', 'sinon'],


    // list of files / patterns to load in the browser
    files: [
      // Vendor

      "app/bower_components/jquery/dist/jquery.js",
      "app/bower_components/angular/angular.js",
      "app/bower_components/angular-resource/angular-resource.js",
      "app/bower_components/angular-cookies/angular-cookies.js",
      "app/bower_components/angular-sanitize/angular-sanitize.js",
      "app/bower_components/angular-ui-router/release/angular-ui-router.js",
      "app/bower_components/underscore/underscore.js",
      "app/bower_components/angular-dnd-module/js/angular-dnd.js",
      "app/bower_components/sifter/sifter.js",
      "app/bower_components/microplugin/src/microplugin.js",
      "app/bower_components/selectize/dist/js/selectize.js",
      "app/bower_components/angular-bootstrap/ui-bootstrap-tpls.js",
      "app/bower_components/angular-xeditable/dist/js/xeditable.js",
      "app/bower_components/chance/chance.js",
      "app/bower_components/firebase/firebase.js",
      "app/bower_components/firebase-simple-login/firebase-simple-login.js",
      "app/bower_components/eventEmitter/EventEmitter.js",

      // Test Specific Vendor

      "app/bower_components/angular-mocks/angular-mocks.js",
      // I can't get these matchers to work at the moment.
      // "app/bower_components/jasmine-sinon/lib/jasmine-sinon.js",

      // Scripts

      "app/mixins/underscore/titleize.js",
      "app/mixins/underscore/deep.js",
      "app/mixins/underscore/pluckDeep.js",
      "app/scripts/app.js",
      "app/scripts/config.js",
      "app/scripts/controllers/application.js",
      "app/scripts/controllers/screens/edit.js",
      "app/scripts/controllers/screens/index.js",
      "app/scripts/controllers/screens/show.js",
      "app/scripts/controllers/interactions/element/edit.js",
      "app/scripts/controllers/interactions/state/edit.js",
      "app/scripts/controllers/registrations.js",
      "app/scripts/controllers/sessions.js",
      "app/scripts/factories/extend.js",
      "app/scripts/factories/models/model.js",
      "app/scripts/factories/collections/collection.js",
      "app/scripts/factories/models/currentUser.js",
      "app/scripts/factories/models/user.js",
      "app/scripts/factories/models/interaction.js",
      "app/scripts/factories/collections/interactionCollection.js",
      "app/scripts/factories/models/rectangle.js",
      "app/scripts/factories/collections/rectangleCollection.js",
      "app/scripts/factories/inspectedRectangle.js",
      "app/scripts/factories/models/screen.js",
      "app/scripts/factories/collections/screenCollection.js",
      "app/scripts/directives/interactive.js",
      "app/scripts/directives/canvas.js",
      "app/scripts/directives/keypressEvents.js",
      "app/scripts/directives/angularSelectize.js",
      "app/scripts/filters/triggerIs.js",
      "app/scripts/filters/actorsInclude.js",

      // Tests

      "spec/**/*Spec.js"
    ],


    // list of files to exclude
    exclude: [
      '**/*.swp',
      'spec/features/**/*.js'
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
