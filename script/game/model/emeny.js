//基本模型

SW.define('game/model/emeny', function(require, exports, module){

	var
		Model = require('game/module/model'),
		
		EmenyModel = Model.derive({

			speed: 0,
			atk: 0,
			cd: 0,
			range: 0,
			vision: 0,

			lockOn: null,

			init: function( x, settings, cache ){
				var self = this;

				self.parent( 'init', x, settings, cache );
				self.speed = Math.floor(1000 / settings.speed);
				self.atk = settings.atk;
				self.cd = settings.cd * 1000;
				self.range = settings.range;
				self.vision = settings.vision;
			},

			update: function(tick){
				var self = this;

				switch(self.command){
					case 'idle':
						break;
					case 'run':
						self.elapseTick += tick - self.lastTick;
						if(self.elapseTick >= self.speed){
							self.x -= Math.floor(self.elapseTick / self.speed);
							self.elapseTick = self.elapseTick % self.speed;
						}
						break;
					case 'back':
						self.elapseTick += tick - self.lastTick;
						if(self.elapseTick >= self.speed){
							self.x += Math.floor(self.elapseTick / self.speed);
							self.elapseTick = self.elapseTick % self.speed;
						}
						break;
					case 'fire':
						self.elapseTick += tick - self.lastTick;
						if(self.elapseTick >= self.cd){
							if(self.lockOn){
								self.lockOn.damage(self.atk);
							}
							self.elapseTick = self.elapseTick % self.cd;
						}
						break;
				}
				self.parent('update', tick);
			},

			drop: function(){
				var self = this;

				self.parent( 'drop' );
			}

		});

	return EmenyModel;
});