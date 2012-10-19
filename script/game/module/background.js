//基本模型

SW.define('game/module/background', function(require, exports, module){

	var Background = SW.Class.extend({

		width: 0,
		height: 0,
		screenWidth: 0,
		imgList: null,
		imgLength: 0,

		cache: null,

		init: function( screenWidth, imgList, width, height, cache ){
			var self = this;

			self.cache = cache;
			self.screenWidth = screenWidth;
			self.width = width;
			self.height = height;
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

				self.cache.drawTo( context, self.imgList[realIndex], posX, 0, self.width, self.height );
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