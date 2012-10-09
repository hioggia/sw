//基本模型

SW.define('game/model/player', function(require, exports, module){

	var
		Model = require('game/module/model'),
		
		PlayerModel = Model.derive({

			speed: 0,
			atk: 0,
			cd: 0,
			range: 0,
			walked: 0,
			walkLength: 0,

			minX: 0,
			maxX: Infinity,
			lockOn: null,

			init: function( x, settings, cache ){
				var self = this;

				self.parent( 'init', x, settings, cache );
				self.speed = Math.floor(1000 / settings.speed);
				self.atk = settings.atk;
				self.cd = settings.cd * 1000;
				self.range = settings.range;
				self.walkLength = settings.walkLength;
			},

			update: function(tick){
				var self = this;

				switch(self.command){
					case 'idle':
						self.walked = 0;
						break;
					case 'run':
						self.elapseTick += tick - self.lastTick;
						if(self.elapseTick >= self.speed){
							var currentWalk = Math.floor(self.elapseTick / self.speed);
							self.walked += currentWalk;
							if(self.walked<=self.walkLength){
								self.x += currentWalk;
								self.elapseTick = self.elapseTick % self.speed;
							}else{
								self.sendCommand('idle');
							}
						}
						break;
					case 'back':
						self.elapseTick += tick - self.lastTick;
						if(self.elapseTick >= self.speed){
							var currentWalk = Math.floor(self.elapseTick / self.speed);
							self.walked += currentWalk;
							if(self.walked<=self.walkLength){
								self.x -= Math.floor(self.elapseTick / self.speed);
								self.elapseTick = self.elapseTick % self.speed;
							}else{
								self.sendCommand('idle');
							}							
						}
						break;
					case 'fire':
						self.elapseTick += tick - self.lastTick;
						if(self.elapseTick >= self.cd){
							if(self.lockOn && self.lockOn.hp>0){
								self.lockOn.damage(self.atk);
								self.elapseTick = self.elapseTick % self.cd;
							}else{
								self.sendCommand('idle');
							}
						}
						break;
				}
				self.x = Math.max(self.minX, Math.min(self.maxX - self.width, self.x));
				self.parent( 'update', tick );
			},

			drop: function(){
				var self = this;

				self.parent( 'drop' );
			}

		});

	return PlayerModel;
});