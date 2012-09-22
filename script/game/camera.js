//基本模型

SW.define('game/camera', function(require, exports, module){

	var Camera = SW.Class.derive({

		x: 0,
		minX: 0,
		maxX: Infinity,
		lockOnObject: null,
		lockOnMinScreenX: 0,
		lockOnMaxScreenX: 0,

		init: function( lockOnObject, lockOnMinScreenX, lockOnMaxScreenX ){
			var self = this;

			self.lockOnObject = lockOnObject;
			self.lockOnMinScreenX = lockOnMinScreenX;
			self.lockOnMaxScreenX = lockOnMaxScreenX;
		},

		setMin: function(x){
			var self = this;

			self.minX = x;
		},

		setMax: function(x){
			var self = this;

			self.maxX = x;
		},

		update: function(tick){
			var
				self = this,
				screenX = self.lockOnObject.x - self.x;

			if(screenX > self.lockOnMaxScreenX){
				self.x = Math.min(self.maxX, self.lockOnObject.x - self.lockOnMaxScreenX);
			}else if(screenX < self.lockOnMinScreenX){
				self.x = Math.max(self.minX, self.lockOnObject.x - self.lockOnMinScreenX);
			}
		},

		drop: function(){
			var self = this;

			self.lockOnObject = null;
		}

	});

	return Camera;
});