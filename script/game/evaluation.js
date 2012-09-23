//基本模型

SW.define('game/evaluation', function(require, exports, module){

	var
		canvas = document.createElement('canvas'),
		context = canvas.getContext('2d'),
		maxX = 0, maxY = 0, minX = Infinity, minY = Infinity,
		points = null, radius = 0, data = null,
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
		context.save();
		context.fillStyle = 'rgb(255,0,0)';
		for(var i=0, len=points.length; i<len; i+=2){
			context.beginPath();
			context.arc(points[i]-minX+radius, points[i+1]-minY+radius, 15, 0, Math.PI*2, false);
			context.fill();
		}
		context.restore();
	}

	function evaluation(shape){
		var forcePixels = 0;
		context.clearRect(0,0,canvas.width,canvas.height);
		drawPoints();
		context.globalCompositeOperation = 'destination-out';
		shapes[shape].draw();
		data = context.getImageData(0,0,canvas.width,canvas.height);
		for(var i=0,len=data.data.length; i<len; i+= 4){
			if(data.data[i+3] != 0){
				forcePixels += 1;
			}
		}
		data = null;
		context.globalCompositeOperation = 'source-over';

		forcePixels = fullPixels - forcePixels;
		if(forcePixels > score){
			score = forcePixels;
			result = shape;
		}
	}

	exports.draw = function (p, r){
		points = p, radius = r, fullPixels = 0, result = '', score = 0;

		for(var i=0, len=points.length; i<len; i+=2){
			maxX = Math.max(points[i], maxX);
			maxY = Math.max(points[i+1], maxY);
			minX = Math.min(points[i], minX);
			minY = Math.min(points[i+1], minY);
		}

		canvas.width = maxX - minX + radius*2;
		canvas.height = maxY - minY + radius*2;

		context.lineWidth = radius*2;

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

		alert([result,score,Math.floor(score/fullPixels*1000)/10+'%'].join(','));
	};

	exports.drawTo = function(context){
		if(canvas.width == 0 || canvas.height == 0){
			return;
		}
		context.drawImage(canvas, minX-15, minY-15);
	};

	return 0;
});