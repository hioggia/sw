//主入口

SW.define('game/main', function(require, exports, module){

	var
		TimeLine = require('modules/timeline'),
		ImageCache = require('modules/imagecache'),
		Camera = require('modules/camera'),

		GameController = require('game/module/controller'),
		Stage = require('game/module/stage'),
		Commander = require('game/module/commander'),
		PlayerModel = require('game/model/player'),

		canvas = document.querySelector('canvas'),
		context  = canvas.getContext('2d'),
		settings = require('game/settings'),
		evaluation = require('game/module/evaluation'),
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
	window.PlayerModel = PlayerModel;
	player = new PlayerModel(30, settings.player, cache);
	camera = new Camera();
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
			player.sendCommand(cmd);
		}
		stage.update(tick);
		camera.watchX(player.x, 30, 300);

		if(player.hp <= 0){
			alert('game over');
			timeline.removeProc(gameRun);
		}

		if( (tick - elapseTime) / duration > 1 ){
			context.clearRect(0,0,settings.width,settings.height);

			stage.drawBackground(context, camera.x);
			stage.drawUnits(context, camera.x, settings.width);

			commander.draw(context, tick);

			context.save();
			context.strokeStyle = 'rgba(255,255,255,0.5)';
			context.lineWidth = settings.paintWidth*2;
			context.lineCap = 'round';
			context.beginPath();
			for(var i=0, len=drawingPoints.length; i<len; i+=2){
				if(drawingPoints[i] == '-'){
					i++;
					context.moveTo(drawingPoints[i], drawingPoints[i+1]);
				}else{
					context.lineTo(drawingPoints[i], drawingPoints[i+1]);
				}
			}
			context.stroke();
			context.restore();

			fps++;
			if(Math.floor(tick / 1000) > secondCounter){
				outputFps = fps;
				fps = 0;
				secondCounter++;
			}
			context.fillText( 'fps: '+outputFps, 800, 80 );
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
		drawingPoints.push('-', x, y);
	});

	controller.addControl('drawing', function(x, y){
		drawingPoints.push(x, y);
	});

	controller.addControl('end', function(x, y){
		drawingPoints.push(x, y);
		waitingDraw = setTimeout(function(){
			evaluationShape();
		},300);
	});

	return 0;
});