//基本模型

SW.define('game/stage', function(require, exports, module){

	var 
		EmenyModel = require('game/model/emeny'),
		Background = require('game/background'),

		Stage = SW.Class.derive({

			playerUnits: [],
			emenyUnits: [],
			background: null,

			init: function( stageConfig, settings, cache ){
				var self = this;

				for(var i=0, len=stageConfig.waves[0].emenys.length; i<len; i++){
					var emenyData = stageConfig.waves[0].emenys[i];
					self.emenyUnits.push( new EmenyModel(emenyData.x, settings[emenyData.name], cache) );
				}
				self.background = new Background(settings.width, stageConfig.backgrounds, stageConfig.backgroundWidth, cache);
			},

			addPlayerUnit: function(player){
				var self = this;

				self.playerUnits.push(player);
			},

			update: function(tick){
				var self = this;

				for(var i=self.emenyUnits.length-1; i>=0; i--){
					var emeny = self.emenyUnits[i];
					if(emeny.hp <= 0){
						emeny.drop();
						self.emenyUnits.splice(i, 1);
					}
					for(var p=0, pLen=self.playerUnits.length; p<pLen; p++){
						var player = self.playerUnits[p];
						if(player.x > emeny.x){
							emeny.lockOn = null;
							emeny.sendCommand('back');
						}else if(player.x + emeny.range >= emeny.x){
							emeny.lockOn = player;
							emeny.sendCommand('fire');
						}else if(player.x + emeny.vision >= emeny.x){
							emeny.lockOn = null;
							emeny.sendCommand('run');
						}
					}
					emeny.update(tick);
				}

				for(var i=0, len=self.playerUnits.length; i<len; i++){
					var player = self.playerUnits[i];
					for(var e=0, eLen = self.emenyUnits.length; e<eLen; e++){
						var emeny = self.emenyUnits[e];
						if(emeny.x - player.range <= player.x){
							player.lockOn = emeny;
							break;
						}
					}
					player.update(tick);
				}
			},

			drawUnits: function(context, x, screenWidth){
				var self = this;

				for(var i=0, len=self.emenyUnits.length; i<len; i++){
					var emeny = self.emenyUnits[i];
					if(emeny.x + emeny.width > x && emeny.x < x + screenWidth){
						emeny.drawTo(context, emeny.x - x);
					}
				}

				for(var i=0, len=self.playerUnits.length; i<len; i++){
					var player = self.playerUnits[i];
					player.drawTo(context, player.x - x);
				}
			},

			drawBackground: function(context, x){
				var self = this;

				self.background.drawTo(context, x);
			},

			drop: function(){
				var self = this;

				self.background.drop();
				self.background = null;
				for(var i=0, len=self.emenyUnits.length; i<len; i++){
					var emeny = self.emenyUnits[i];
					emeny.drop();
				}
			}

		});

	return Stage;
});