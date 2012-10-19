//基本模型

SW.define('game/module/model', function(require, exports, module){

	var
		Damage = require('game/module/damage'),

		ViewModel = require('modules/viewmodel'),

		Model = ViewModel.extend({

			imgUrl: undefined,
			sprites: null,
			frameTime: 0,

			hp: 0,
			maxHp: 0,

			command: 'idle',
			cache: null,
			lastTick: 0,
			elapseTick: 0,
			animeTick: 0,

			damageList: [],

			init: function( x, settings, cache ){
				var self = this;
				
				self.parent( 'init', x, settings.y, settings.width, settings.height );
				self.imgUrl = settings.imgUrl;
				self.sprites = settings.sprites;
				self.frameTime = settings.frameTime * 1000;
				self.cache = cache;

				self.hp = settings.hp;
				self.maxHp = settings.hp;
			},

			sendCommand: function(command){
				var self = this;

				if(self.command != command){
					self.elapseTick = 0;
					self.animeTick = 0;
				}
				self.command = command;
			},

			damage: function(damage){
				var self = this;

				self.damageList.push( new Damage(damage) );
				self.hp -= damage;
			},

			update: function(tick){
				var self = this;

				for(var i=self.damageList.length-1; i>=0; i--){
					var damage = self.damageList[i];
					damage.update(tick);
					if(damage.end){
						damage.drop();
						self.damageList.splice(i, 1);
					}
				}
				self.lastTick = tick;
				if(self.animeTick == 0){
					self.animeTick = tick;
				}
			},

			drawTo: function(context, x){
				var
					self = this,
					sx = 0,
					sy = 0,
					sprite = null,
					frame = 0;

				sprite = self.sprites[self.command];
				frame = Math.floor((self.lastTick-self.animeTick) / self.frameTime) % sprite.length;
				sx = sprite[frame] * self.width;
				self.cache.drawTo( context, self.imgUrl, sx, sy, self.width, self.height, x, self.y, self.width, self.height );

				context.save();
				context.strokeStyle = '#000';
				context.strokeRect(x, self.y-10, 100, 10);
				context.fillStyle = '#0f0';
				context.fillRect(x, self.y-10, Math.round(self.hp/self.maxHp*100), 10);
				context.restore();

				for(var i=0, len=self.damageList.length; i<len; i++){
					self.damageList[i].drawTo(context, x+self.width/2, self.y);
				}
			},

			drop: function(){
				var self = this;

				self.parent('drop');
				self.cache = null;
			}

		});

	return Model;
});