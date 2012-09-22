//基本模型

SW.define('game/background', function(require, exports, module){

	var Background = SW.Class.derive({

		width: 0,
		screenWidth: 0,
		imgList: null,
		imgLength: 0,

		cache: null,

		init: function( screenWidth, imgList, imgWidth, cache ){
			var self = this;

			self.cache = cache;
			self.screenWidth = screenWidth;
			self.width = imgWidth;
			self.imgList = imgList;
			self.imgLength = self.imgList.length;
		},

		drawTo: function(context, x){
			var
				self = this,
				index = Math.floor( x / self.width ),
				cross = Math.ceil( (x + self.screenWidth - index * self.width) / self.width );

			for(var end=index+cross;index<end;index++){
				var realIndex = index % self.imgLength,
					posX = index * self.width - x;
				if( !self.cache.has(self.imgList[realIndex]) ){
					self.cache.attach(self.imgList[realIndex]);
					continue;
				}
				context.drawImage( self.cache.get(self.imgList[realIndex]), posX, 0 );
			}
		},

		drop: function(){
			var self = this;

			for(var i=0, len=self.imgLength; i<len; i++){
				self.cache.erase( self.imgList[i] );
			}
			self.cache = null;
		}

	});

	return Background;
});