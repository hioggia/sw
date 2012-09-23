//基本模型

SW.define('game/controller', function(require, exports, module){

	var
		Controller = require('modules/controller'),
		typeOfTouchEvent = 'ontouchstart' in window,
		typeOfStartEvent = typeOfTouchEvent ? 'touchstart' : 'mousedown',
		typeOfMoveEvent = typeOfTouchEvent ? 'touchmove' : 'mousemove',
		typeOfEndEvent = typeOfTouchEvent ? 'touchend' : 'mouseup',

		GameController = SW.Class.derive({

			canvas: null,
			controller: null,

			isStarted: false,
			customEvents: {
				'start': [],
				'drawing': [],
				'end': []
			},

			init: function(canvas){
				var self = this;

				self.canvas = canvas;
				self.controller = new Controller();

				self.controller.bind(window, 'touchstart', function(ev){ ev.preventDefault() });
				self.controller.bind(self.canvas, typeOfStartEvent, self.startEvent.bind(self));
				self.controller.bind(self.canvas, typeOfEndEvent, self.endEvent.bind(self));
				self.controller.bind(self.canvas, typeOfMoveEvent, self.moveEvent.bind(self));
			},

			addControl: function(type, handler){
				var self = this;
				
				if(type in self.customEvents){
					self.customEvents[type].push( handler );
				}
			},

			startEvent: function(ev){
				var self = this;

				self.isStarted = true;

				if(ev.touches){
					x = ev.touches[0].pageX;
					y = ev.touches[0].pageY;
				}else{
					x = ev.pageX;
					y = ev.pageY;
				}

				for(var i=0, len=self.customEvents.start.length; i<len; i++){
					self.customEvents.start[i].call(null, x, y);
				}
			},

			endEvent: function(ev){
				var
					self = this,
					x = 0,
					y = 0;

				self.isStarted = false;

				if(ev.changedTouches){
					x = ev.changedTouches[0].pageX;
					y = ev.changedTouches[0].pageY;
				}else{
					x = ev.pageX;
					y = ev.pageY;
				}

				for(var i=0, len=self.customEvents.end.length; i<len; i++){
					self.customEvents.end[i].call(null, x, y);
				}
			},

			moveEvent: function(ev){
				var
					self = this,
					x = 0,
					y = 0;

				if(!self.isStarted){
					return;
				}

				if(ev.changedTouches){
					x = ev.changedTouches[0].pageX;
					y = ev.changedTouches[0].pageY;
				}else{
					x = ev.pageX;
					y = ev.pageY;
				}

				for(var i=0, len=self.customEvents.drawing.length; i<len; i++){
					self.customEvents.drawing[i].call(null, x, y);
				}
			},

			drop: function(){
				var self = this;

				self.controller.drop();
				self.controller = null;
				self.canvas = null;

				for(var key in self.customEvents){
					self.customEvents[key] = [];
				}
			}

		});

	return GameController;
});