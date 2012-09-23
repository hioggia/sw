//傷害

SW.define('game/commander', function(require, exports, module){

	var 
		easing = require('modules/ease'),

		Commander = SW.Class.derive({

			cache: null,
			imgUrl: undefined,
			imgSize: 0,
			shapes: null,
			target: null,
			leastScore: 0,

			command: [],
			animeCommand: [],

			init: function( settings, cache ){
				var self = this;

				self.cache = cache;
				self.imgUrl = settings.imgUrl;
				self.imgSize = settings.size;
				self.shapes = settings.shapes;
				self.target = settings.target;
				self.leastScore = settings.leastScore;

				self.target.time = self.target.time * 1000;
			},

			addCommand: function(result){
				var self = this;

				console.log(result.shape, result.score);
				if(result.score>self.leastScore){
					self.animeCommand.push({shape:result.shape,lastTick:undefined,pos:self.command.length,size:result.size,x:result.x,y:result.y});
					self.command.push(result.shape.substring(0,1));
				}
			},

			getCommand: function(){
				var self = this;

				if(self.command.length<4){
					return null;
				}

				return self.command.splice(0,4);
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
			},

			drop: function(){
				var self = this;

			}

		});

	return Commander;
});