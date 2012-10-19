//傷害

SW.define('game/module/commander', function(require, exports, module){

	var 
		easing = require('modules/ease'),

		Commander = SW.Class.extend({

			cache: null,
			imgUrl: undefined,
			imgSize: 0,
			shapes: null,
			target: null,
			leastScore: 0,

			command: [],
			animeCommand: [],
			fever: 0,
			maxFever: 0,

			init: function( settings, cache ){
				var self = this;

				self.cache = cache;
				self.imgUrl = settings.imgUrl;
				self.imgSize = settings.size;
				self.shapes = settings.shapes;
				self.target = settings.target;
				self.leastScore = settings.leastScore;
				self.maxFever = settings.maxFever;

				self.target.time = self.target.time * 1000;
			},

			addCommand: function(result){
				var self = this;

				if(result.score>self.leastScore){
					self.animeCommand.push({shape:result.shape,lastTick:undefined,pos:self.command.length,size:result.size,x:result.x,y:result.y});
					self.command.push(result.shape);
					self.fever += result.score / 10;
					if(self.fever > self.maxFever){
						self.fever = self.maxFever;
					}
				}
			},

			getCommand: function(){
				var self = this;

				if(self.command.length<4){
					return null;
				}

				var cmd = self.command.splice(0,4).join('');
				switch(cmd){
					case 'oook':
						return 'run';
					case 'okok':
						return 'back';
					case 'kkok':
						return 'fire';
					default:
						return 'idle';
				}
			},

			getFever: function(){
				var self = this;

				return self.fever;
			},

			useFever: function(cost){
				var
					self = this,
					used = 0;

				used = Math.min(self.fever, cost);
				self.fever -= used;
				return used;
			},

			draw: function(context, tick){
				var
					self = this,
					allDone = 0;

				for(var i=0, len=self.animeCommand.length; i<len; i++){
					var
						ac = self.animeCommand[i],
						percent = 0,
						sx = self.shapes[ac.shape] * self.imgSize,
						sy = 0,
						cx = self.target.x + ac.pos * (self.target.size + self.target.gap),
						cy = self.target.y,
						csize = self.target.size;
					
					if(ac.lastTick == undefined){
						ac.lastTick = tick;
					}else{
						percent = (tick - ac.lastTick) / self.target.time;
					}

					if(percent<1){
						csize = easing('cubicIn', percent) * (self.target.size - ac.size) + ac.size;
						cx = easing('cubicIn', percent) * (cx - ac.x) + ac.x;
						cy = easing('cubicIn', percent) * (cy - ac.y) + ac.y;
					}else{
						allDone++;
					}

					self.cache.drawTo(context, self.imgUrl, sx, sy, self.imgSize, self.imgSize, cx, cy, csize, csize);
				}

				if(allDone >= 4 && tick - self.animeCommand[3].lastTick >= 4500 ){
					self.animeCommand.splice(0, 4);
				}

				context.save();
				context.strokeStyle = '#000';
				context.strokeRect( 10, 90, 300, 40 );
				context.fillStyle = '#ddb708';
				context.fillRect( 10, 90, Math.round(self.fever/self.maxFever*300), 40 );
				context.restore();
			},

			drop: function(){
				var self = this;

			}

		});

	return Commander;
});