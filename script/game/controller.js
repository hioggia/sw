//基本模型

SW.define('game/controller', function(require, exports, module){

	var
		Controller = require('modules/controller'),

		GameController = SW.Class.derive({

			canvas: null,
			controller: null,

			init: function(canvas){
				var self = this;

				self.canvas = canvas;
				self.controller = new Controller();
			},

			addControl: function(type, handler){
				var self = this;
				
				self.controller.bind(self.canvas, type, handler);
			},

			drop: function(){
				var self = this;

				self.controller.drop();
				self.controller = null;
				self.canvas = null;
			}

		});

	return GameController;
});