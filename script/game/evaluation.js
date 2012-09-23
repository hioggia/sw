//基本模型

SW.define('game/evaluation', function(require, exports, module){

	var
		canvas = document.createElement('canvas'),
		context = canvas.getContext('2d'),
		points = null, radius = 0, minX = 0, minY = 0,
		fullPixels = 0, result = '', score = 0,
		shapes = {
			square: {},
			round: {},
			cross: {},
			triangle: {}
		};

	shapes.square.draw = function(){
		context.save();
		context.strokeRect(radius,radius,canvas.width-radius*2,canvas.height-radius*2);
		context.restore();
	};

	shapes.round.draw = function(){
		context.save();
		context.beginPath();
		context.arc(canvas.width/2,canvas.height/2,(canvas.width+canvas.height)/4-radius,0,Math.PI*2,false);
		context.stroke();
		context.restore();
	};

	shapes.cross.draw = function(){
		context.save();
		context.beginPath();
		context.moveTo(radius,radius);
		context.lineTo(canvas.width-radius,canvas.height-radius);
		context.moveTo(canvas.width-radius,radius);
		context.lineTo(radius,canvas.height-radius);
		context.stroke();
		context.restore();
	};

	shapes.triangle.draw = function(){
		context.save();
		context.beginPath();
		context.moveTo(canvas.width/2,radius);
		context.lineTo(canvas.width-radius,canvas.height-radius);
		context.lineTo(radius,canvas.height-radius);
		context.closePath();
		context.stroke();
		context.restore();
	};

	function drawPoints(){
		context.beginPath();
		for(var i=0, len=points.length; i<len; i+=2){
			if(points[i] == '-'){
				i++;
				context.moveTo(points[i]-minX+radius, points[i+1]-minY+radius);
			}else{
				context.lineTo(points[i]-minX+radius, points[i+1]-minY+radius);
			}
		}
		context.stroke();
	}

	function evaluation(shape){
		var
			forcedPixels = 0,
			data = null;
		context.clearRect(0,0,canvas.width,canvas.height);
		drawPoints();
		context.globalCompositeOperation = 'destination-out';
		shapes[shape].draw();
		data = context.getImageData(0,0,canvas.width,canvas.height);
		for(var i=0,len=data.data.length; i<len; i+= 4){
			if(data.data[i+3] != 0){
				forcedPixels += 1;
			}
		}
		data = null;
		context.globalCompositeOperation = 'source-over';

		forcedPixels = fullPixels - forcedPixels;
		if(forcedPixels > score){
			score = forcedPixels;
			result = shape;
		}
	}

	return function (p, r){
		var data = null, maxX = 0, maxY = 0, size = 0;

		//reset
		points = p, radius = r, minX = Infinity, minY = Infinity, fullPixels = 0, result = '', score = 0;

		for(var i=0, len=points.length; i<len; i+=2){
			if(points[i] == '-'){
				i++;
			}
			maxX = Math.max(points[i], maxX);
			maxY = Math.max(points[i+1], maxY);
			minX = Math.min(points[i], minX);
			minY = Math.min(points[i+1], minY);
		}

		size = Math.max(maxX - minX, maxY - minY);

		canvas.width = size + radius*2;
		canvas.height = size + radius*2;

		context.lineWidth = radius*3; //容錯率1.5倍
		context.lineCap = 'round';

		drawPoints();
		data = context.getImageData(0,0,canvas.width,canvas.height);
		for(var i=0,len=data.data.length; i<len; i+= 4){
			if(data.data[i+3] != 0){
				fullPixels += 1;
			}
		}
		data = null;

		for(var key in shapes){
			evaluation(key);
		}

		return {
			shape: result,
			score: Math.floor(score/fullPixels*1000)/10,
			x: minX,
			y: minY,
			size: size
		};
	};
});