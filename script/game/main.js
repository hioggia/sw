//主入口

SW.define('game/main', function(require, exports, module){

	var
		TimeLine = require('modules/timeline'),
		ImageCache = require('modules/imagecache'),

		GameController = require('game/controller'),
		Camera = require('game/camera'),
		Stage = require('game/stage'),
		Commander = require('game/commander'),
		PlayerModel = require('game/model/player'),

		canvas = document.querySelector('canvas'),
		context  = canvas.getContext('2d'),
		settings = require('game/settings'),
		evaluation = require('game/evaluation'),
		timeline = new TimeLine(),
		cache = new ImageCache(),
		controller = null,
		player = null,
		stage = null,
		camera = null,
		commander = null,

		duration = 1000 / settings.fps,
		elapseTime = 0,
		drawingPoints = [],
		waitingDraw = 0,

		nowStage = 1,

		fps = 0,
		outputFps = 0,
		secondCounter = 0;

	canvas.width = settings.width;
	canvas.height = settings.height;

	context.font = settings.font;

	controller = new GameController(canvas);
	player = new PlayerModel(30, settings.player, cache);
	camera = new Camera(player, 30, 300);
	commander = new Commander(settings.evaluation, cache);

	require('game/stage/'+nowStage,function(exports){

		stage = new Stage(exports, settings, cache);
		stage.addPlayerUnit(player);
		window.stage = stage;
		timeline.addProc(gameRun);

	});

	function gameRun(tick){
		var cmd = commander.getCommand();
		if(cmd != null){
			cmd = cmd.join('');
			switch(cmd){
				case 'rrrs':
					player.sendCommand('run');
					break;
				case 'srsr':
					player.sendCommand('back');
					break;
				case 'ssrs':
					player.sendCommand('fire');
					break;
				default:
					player.sendCommand('idle');
					break;
			}
		}
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

			commander.draw(context, tick);

			context.save();
			context.fillStyle = 'rgba(255,255,255,0.5)';
			for(var i=0, len=drawingPoints.length; i<len; i+=2){
				context.beginPath();
				context.arc(drawingPoints[i], drawingPoints[i+1], settings.paintWidth, 0, Math.PI*2, false);
				context.fill();
			}
			context.restore();

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

	function evaluationShape(){
		var result = evaluation(drawingPoints, settings.paintWidth);
		commander.addCommand(result);
		drawingPoints = [];
	};

	controller.addControl('start', function(x, y){
		clearTimeout(waitingDraw);
		drawingPoints.push(x, y);
	});

	controller.addControl('drawing', function(x, y){
		drawingPoints.push(x, y);
	});

	controller.addControl('end', function(x, y){
		waitingDraw = setTimeout(function(){
			evaluationShape();
		},300);
	});

	return 0;
});