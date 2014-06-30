'use strict';

// (function(app) {
// 
//   var init = function(attrs) {
//     attrs || (attrs = {});
//     var name = attrs.name || chance.word();
//     delete attrs.name;
// 
//     var defaults = {
//       name: name,
//       elements: [],
//       elementNames: function() {
//         return this.elements.map(function(shape) { return shape.name; });
//       },
//       elementIds: function() {
//         return ('#' + this.elementNames().join(', #'));
//       },
// 
//       top: function() {
//         if (_.isEmpty(this.elements)) return 0;
//         return _.min(this.elements.map(function(el) { return el.top(); }));
//       },
// 
//       left: function() {
//         if (_.isEmpty(this.elements)) return 0;
//         return _.min(this.elements.map(function(el) { return el.left(); }));
//       },
// 
//       bottom: function() {
//         if (_.isEmpty(this.elements)) return 0;
//         return _.max(this.elements.map(function(el) { return el.bottom(); }));
//       },
// 
//       right: function() {
//         if (_.isEmpty(this.elements)) return 0;
//         return _.max(this.elements.map(function(el) { return el.right(); }));
//       },
// 
//       height: function() {
//         if (_.isEmpty(this.elements)) return 0;
//         return this.bottom() - this.top();
//       },
// 
//       width: function() {
//         if (_.isEmpty(this.elements)) return 0;
//         return this.right() - this.left();
//       },
// 
//       style: function() {
//         return {
//           top: this.top() + 'px',
//           left: this.left() + 'px',
//           height: this.height() + 'px',
//           width: this.width() + 'px'
//         };
//       },
// 
//       toJSON: function() {
//         return {
//           elements: this.elements.map(function(el) {
//             console.log("Mapping group element", el, el.guid);
//             return el.guid;
//           })
//         };
//       },
//     };
//     return angular.extend(defaults, attrs);
//   }
// 
//   app.factory('GroupsFactory', ['RectFactory', factory]);
//       
//   function factory(RectFactory) {
//     var factory = {};
//     var data = [];
// 
//     factory.all = function() {
//       return data;
//     };
// 
//     factory.parse = function(attrs) {
//       var that = this;
//       [].concat(attrs || []).map(function(attr) {
//         // On the server, groups only store the guids of the elements
//         // they contain. Thus, when we parse them, we have to lookup the guids
//         // and set references to the actual objects on the client.
//         if (typeof attr.elements !== "undefined") {
//           attr.elements = attr.elements.map(function(guid) {
//             return RectFactory.findByGuid(guid);
//           });
//         }
// 
//         that.create(attr);
//       });
//       return this.all();
//     }
// 
//     factory.create = function(attrs) {
//       data.push(init(attrs));
//     };
// 
//     factory.toJSON = function() {
//       return data.map(function(group) { return group.toJSON(); });
//     }
// 
//     return factory;
//   }
// })(drawingApp);
