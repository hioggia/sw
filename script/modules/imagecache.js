// 圖像快取管理員

SW.define('modules/imagecache', function(require, exports, module){

	var ImageCache = SW.Class.derive({

		attached: 0,
		cached: 0,
		callbacks: [],
		loading: {},
		caches: {},

		onload: null,
		onerror: null,

		init: function(){
			var self = this;

			self.onload = self._onload.bind(self);
			self.onerror = self._onerror.bind(self);
		},

		attach: function( url ){
			var self = this;

			if( (url in self.caches) || (url in self.loading) ){
				return;
			}
			
			SW.log( '載入圖像: ' + url );
			
			self.attached++;
			
			var img = self.loading[url] = new Image();
			
			img.addEventListener( 'load', self.onload, false );
			img.addEventListener( 'error', self.onerror, false );
			
			img.setAttribute('data-url', url);
			img.src = url;
		},

		erase: function( url ){
			var self = this;

			if( url in self.caches ){
				SW.log('移除快取: ' + url);

				self.caches[url] = null;
				delete self.caches[url];

				self.cached--;
				self.attached--;
			}
		},

		get: function( url ){
			var self = this;
				
			if( url in self.caches ){
				return self.caches[url];
			}
			
			SW.log( '請求的圖像不存在快取中: ' + url );
			return null;
		},

		complete: function( callback ){
			var self = this;
				
			if( typeof callback != 'function' ){
				return;
			}
			
			for( var i=0, len=self.callbacks.length; i<len; i++ ){
				if( self.callbacks[i] == callback ){
					return;
				}
			}
			
			SW.log('回調已設置');
			self.callbacks.push( callback );
		},

		has: function( url ){
			var self = this;
				
			return url in self.caches;
		},
		
		clear: function(){
			var self = this;
			
			self.attached = 0;
			self.cached = 0;
			self.callbacks = [];
			
			for(var url in self.loading){
				self.loading[url].removeEventListener( 'load', self.onload, false );
				self.loading[url].removeEventListener( 'error', self.onerror, false );
				self.loading[url].removeAttribute('data-url');
				self.loading[url] = null;
				delete self.loading[url];
			}
			
			for(var url in self.caches){
				self.caches[url] = null;
				delete self.caches[url];
			}

			SW.log('快取已清零');
		},

		drop: function(){
			var self = this;

			self.clear();
			self.caches = null;
			self.loading = null;
			self.onload = null;
			self.onerror = null;
		},
		
		_onload: function( ev ){
			var
				self = this,
				img = ev.target,
				url = img.getAttribute('data-url');

			img.removeAttribute('data-url');
			
			self.caches[url] = img;
			self.loading[url] = null;
			delete self.loading[url];
			
			img.removeEventListener( 'load', self.onload, false );
			img.removeEventListener( 'error', self.onerror, false );
			
			self.cached++;
			
			if( self.cached == self.attached && self.callbacks.length > 0 ){
				for(var i=0, len=self.callbacks.length; i<len; i++ ){
					self.callbacks.shift()();
				}
			}
		},
		
		_onerror: function( ev ){
			var
				self = this,
				img = ev.target,
				url = img.getAttribute('data-url');

			img.removeAttribute('data-url');
			
			SW.log( '載入圖像失敗: ' + url );
			
			self.loading[url] = null;
			delete self.loading[url];
			
			img.removeEventListener( 'load', self.onload, false );
			img.removeEventListener( 'error', self.onerror, false );
			
			self.attached--;
		}

	});

	return ImageCache;

});