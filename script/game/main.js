//主入口

SW.define('game/main', function(require, exports, module){

	var
		TimeLine = require('modules/timeline'),
		ImageCache = require('modules/imagecache'),

		GameController = require('game/controller'),
		Camera = require('game/camera'),
		Stage = require('game/stage'),
		PlayerModel = require('game/model/player'),

		canvas = document.querySelector('canvas'),
		context  = canvas.getContext('2d'),
		settings = require('game/settings'),
		timeline = new TimeLine(),
		cache = new ImageCache(),
		controller = null,
		player = null,
		stage = null,
		camera = null,

		duration = 1000 / settings.fps,
		elapseTime = 0,

		nowStage = 1,

		fps = 0,
		outputFps = 0,
		secondCounter = 0;

	canvas.width = settings.width;
	canvas.height = settings.height;

	context.font = settings.font;

	controller = new GameController(canvas);
	player = new PlayerModel( 30, settings.player, cache );
	camera = new Camera(player, 30, 300);

	require('game/stage/'+nowStage,function(exports){

		stage = new Stage(exports, settings, cache);
		stage.addPlayerUnit(player);
		window.stage = stage;
		timeline.addProc(gameRun);

	});

	function gameRun(tick){
		stage.update(tick);
		camera.update(tick);

		if( (tick - elapseTime) / duration > 1 ){

			stage.drawBackground(context, camera.x);
			stage.drawUnits(context, camera.x, settings.width);

			context.fillText( player.hp, 850, 40 );

			if(player.hp <= 0){
				alert('game over');
				timeline.removeProc(gameRun);
			}

			fps++;
			if(Math.floor(tick / 1000) > secondCounter){
				outputFps = fps;
				fps = 0;
				secondCounter++;
			}
			context.fillText( 'fps: '+outputFps, 10, 40 );
		}
		elapseTime = tick - tick % duration;
	};

	controller.addControl('ontouchstart' in window ? 'touchstart' : 'mousedown', function(ev){
		if(ev.pageX>settings.width/2){
			player.sendCommand('run');
		}else{
			player.sendCommand('back');
		}
	});

	controller.addControl('ontouchstart' in window ? 'touchend' : 'mouseup', function(){
		player.sendCommand('idle');
	});

	return 0;
});