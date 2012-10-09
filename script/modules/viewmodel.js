//基本模型

SW.define('modules/viewmodel', function(require, exports, module){

	var ViewModel = SW.Class.derive({

			x: 0,
			y: 0,
			width: 0,
			height: 0,

			init: function( x, y, width, height ){
				var self = this;

				self.x = x;
				self.y = settings.y;
				self.width = settings.width;
				self.height = settings.height;
			},

			drop: function(){
				var self = this;

			}

		});

	return ViewModel;
});