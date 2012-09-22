//傷害

SW.define('game/damage', function(require, exports, module){

	var Damage = SW.Class.derive({

		damage: 0,
		yOffset: 0,
		alpha: 1,
		elapseTick: 0,
		lastTick: 0,
		frameTime: 20,

		end: false,

		init: function( damage ){
			var self = this;

			self.damage = damage;
		},

		update: function(tick){
			var self = this;

			if(self.lastTick == 0){
				self.lastTick = tick;
			}
			self.elapseTick += tick - self.lastTick;
			if(self.elapseTick >= self.frameTime){
				self.yOffset -= Math.floor(self.elapseTick / self.frameTime);
				self.alpha -= 0.025;
				self.elapseTick = self.elapseTick % self.frameTime;
				if(self.alpha <= 0){
					self.end = true;
				}
			}
			self.lastTick = tick;
		},

		drawTo: function(context, x, y){
			var self = this;

			context.save();
			context.textAlign = 'center';
			context.textBaseline = 'middle';
			context.fillStyle = 'rgb(255,0,0)';
			context.font = '20px sans-serif';
			context.globalAlpha = self.alpha;
			context.fillText( '-'+self.damage, x, y+self.yOffset );
			context.restore();
		},

		drop: function(){
			var self = this;

		}

	});

	return Damage;
});