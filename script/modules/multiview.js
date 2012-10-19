//多視圖
//注意，此模塊返回的exports為引用類型

SW.define('modules/multiview', function(require, exports, module){

	var
		path = '',
		lastView = '',
		viewStack = [],
		subViews = {},

		multiView = {

			defineSubView: function(key, content){
				subViews[key] = new SubViewModel(key);
				content.apply(subViews[key]);
			},

			getSubView: function(key){
				return subViews[key];
			},

			switch: function(key){
				if(key in subViews){
					if(lastView != ''){
						subViews[lastView].end();
					}
					viewStack.pop();
					viewStack.push(key);
					lastView = key;
				}else{
					loadView(key, function(){
						multiView.switch(key);
					});
				}
			},

			pop: function(key){
				if(key in subViews){
					viewStack.push(key);
					lastView = key;
				}else{
					loadView(key, function(){
						multiView.pop(key);
					});
				}
			},

			drawTo: function(context){

			}

		},

		SubViewModel = SW.Class.extend({

			key: '',
			elements: {},

			init: function(key){
				var self = this;

				self.key = key;
			},

			addElement: function(key, content){
				var self = this;

				self.elements[key] = content;
			},

			addControl: function(key, type, area, handler){
				var self = this;

			},

			start: function(){
				var self = this;

				if(typeof self.onStart == 'function'){
					self.onStart.apply(self);
				}
			},

			end: function(){
				var self = this;

				if(typeof self.onEnd == 'function'){
					self.onEnd.apply(self);
				}
			},

			drawTo: function(context, x, y){
				var self = this;
			},

			drop: function(){
				var self = this;

				subViews[self.key] = null;
				delete subViews[self.key];
			}

		});

	multiView.__defineSetter__( 'path', function(value){
		path = value;
	} );

	multiView.__defineGetter__( 'path', function(){
		return path;
	} );

	function loadView(key, callback){
		require( path + key, callback );
	}

	return multiView;
});