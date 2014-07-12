'use strict';

(function(app) {
  app.controller('ScreensEditController', [
    '$scope',
    '$stateParams',
    'InspectedRectangle', 
    'Interaction',
    'Screen', 
    'Rectangle', 
    ctrl
  ]);

  function ctrl($scope, $stateParams, InspectedRectangle, Interaction, Screen, Rectangle) {
    // This is one of the instances where I can't pass in the reference to
    // Firebase and must pass in the ID instead (well, technically I could
    // construct the reference out here with "new Firebase()" but I would
    // rather do that in the model layer). This exemplifies why I do need
    // to retain the ability to infer a  resource from an $id.
    //
    // So far however, I don;t see a reason to be able to lazily calc the
    // reference like I'm doing at the moment with #resource. There should
    // be a method where you pass in an $id and get back a reference. I can
    // then call it in the initializer as needed (like here) or directly
    // (like I need to do with user in the ApplicationController).
    //
    // Another problem is that there's some sort of race condition going on
    // here. Sometimes I refresh the page and don't get any screen data
    // appearing. (Update: I suspect the actual cause of this might have been
    // the fact that screens weren't appearing when transitioning between
    // pages).
    $scope.screen = new Screen({ '$id': $stateParams.id });
    $scope.screen.fetch();

    $scope.rectangles = $scope.screen.rectangles.asArray();
    $scope.interactions = $scope.screen.interactions.asArray();
    $scope.screen.interactions.rectangles = $scope.screen.rectangles;

    // I would love to do something like iterate over the interaction
    // actorIds and match them up with rectangles. My initial thought against
    // this was that it won't work because the interactions might not load
    // at the same time as the rectangles. That's not true though, they both
    // become available as soon as the screen loads.
    //
    // It appears to be a pain in the nuts to wire them together though.
    // I might be better storing the actors in firebase like this:
    //
    // actorIds:
    //   jkhsjkdhes:
    //     name: 'the-rect-name'
    //     id: 'the-shape-firebase-id'
    //
    // Then I could change the preview logic to apply the interaction 
    // functions based on the shape ids which could be embedded in the DOM
    // as ID attributes. The problem is that if the name of a shape changes
    // I have to update it in two places. It would be much better to only
    // rely on the ID - which can't change (or on object references which 
    // will change together if they change at all).
    //
    // Perhaps this is actually a full on many-to-many relationship and I'm
    // trying to treat it half assed. Perhaps each interaction should have
    // a RectangleCollection for triggers and for actors. I could then
    // properly parse the IDs on 'value' like I'm doing for the User -> Screen
    // relationship. I'm gonna have to try a couple of different things.
    //
    // I tried giving the interactions collection a reference to the rectangles
    // like this:
    //
    //   $scope.screen.interactions.rectangles = $scope.screen.rectangles;
    //
    // The problem with that is that it's in the individual interaction that
    // I need the reference to the rectangles collection. I would imagine 
    // it would be handy if each interaction had a reference to it's
    // collection in general so I should probably set that up and kill two
    // birds.

    $scope.interactionActions = Interaction.actions;
    $scope.interactionTriggers = Interaction.triggers;
    $scope.interactionElements = $scope.rectangles;

    $scope.createRectangle = function() {
      var attrs = Rectangle.initialAttributes();
      $scope.screen.rectangles.create(attrs);
    };

    // TODO: Move all this interaction stuff out oft here.

    $scope.createInteraction = function() {
      var attrs = Interaction.initialAttributes({
        triggers: [$scope.inspectedShape]
      });
      $scope.screen.interactions.create(attrs);
    };

    $scope.highlightElement = function(name) {
      $scope.unhighlightAll();
      var elements = $scope.screen.rectangles.where({ name: name })
      elements.forEach(function(rect) {
        rect.highlight();
      });
    };

    $scope.unhighlightAll = function() {
      $scope.screen.rectangles.unhighlightAll();
    };

    $scope.inspectedShape = InspectedRectangle.inspected();
    $scope.$watch(function() { return InspectedRectangle.inspected(); },
      function(newVal, oldVal) {
        $scope.inspectedShape = newVal;
    });

    // IDEA: Perhaps this should be done by calling "rect.select()" in the
    // view then having a watcher here in the controller to do the rest
    // of this stuff when the "isSelected" value of a shape changes?
    $scope.selectOnlyShape = function(shape) {
      if (typeof shape === "undefined") return;
      $scope.clearSelectedShapes();
      shape.select();
      $scope.selectedShapes.push(shape);
      InspectedRectangle.inspected(shape);
    };

    $scope.clearSelectedShapes = function() {
      $scope.selectedShapes = [];
      $scope.screen.rectangles.deselectAll();
      InspectedRectangle.clear();
    };

    $scope.addSelectedShape = function(shape) {
      shape.select();
      $scope.selectedShapes.push(shape);
      InspectedRectangle.clear();
    };

    $scope.destroySelectedShapes = function() {
      $scope.selectedShapes.forEach(function(shape) { shape.destroy(); });
      InspectedRectangle.clear();
    };

    // $scope.selectOnlyShape($scope.rectangles.collection[0]);

//      $scope.groups = GroupsFactory.parse(contents.groups);
//
//
//      $scope.createGroup = function() {
//        GroupsFactory.create({ elements: RectFactory.selected() });
//      }
//
//      // NOTE: This is being broken by the dnd-selectable="true" directive
//      // on the rectangles. You can notice that the rectangle is not selected
//      // correctly when the page first loads. Removing this directive will
//      // fix this at the expense of making shapes not lasso selectable.
//      $scope.selectOnlyShape($scope.rectangles[0]);
//    });
  }
})(drawingApp);

