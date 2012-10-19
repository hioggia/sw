//傷害

SW.define('game/module/damage', function(require, exports, module){

	var 
		easing = require('modules/ease'),

		Damage = SW.Class.extend({

			damage: 0,
			yOffset: 0,
			alpha: 1,
			lastTick: 0,
			targetTime: 2000,
			targetY: 100,

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
				if(tick - self.lastTick <= self.targetTime){
					var percent = easing('easeOut', (tick - self.lastTick)/self.targetTime);
					self.yOffset = percent * self.targetY;
					self.alpha = 1 - percent;
				}else{
					self.end = true;
				}
			},

			drawTo: function(context, x, y){
				var self = this;

				context.save();
				context.textAlign = 'center';
				context.textBaseline = 'middle';
				context.fillStyle = 'rgb(255,0,0)';
				context.font = '20px sans-serif';
				context.globalAlpha = self.alpha;
				context.fillText( '-'+self.damage, x, y-self.yOffset );
				context.restore();
			},

			drop: function(){
				var self = this;

			}

		});

	return Damage;
});