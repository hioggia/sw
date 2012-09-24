//基本模型

SW.define('game/evaluation', function(require, exports, module){

	var
		canvas = document.createElement('canvas'),
		context = canvas.getContext('2d'),
		points = null, radius = 0, minX = 0, minY = 0,
		result = '', pixels = 0, score = 0,

		shapes = {
			k: function(){
				context.save();
				context.lineWidth = radius*2;
				context.beginPath();
				context.moveTo(radius,radius);
				context.lineTo(canvas.width-radius,radius);
				context.lineTo(canvas.width-radius,canvas.height-radius);
				context.lineTo(radius,canvas.height-radius);
				context.stroke();
				context.restore();
			},

			o: function(){
				context.save();
				context.lineWidth = radius*2;
				context.beginPath();
				context.arc(canvas.width/2,canvas.height/2,(canvas.width+canvas.height)/4-radius,0,Math.PI*2,false);
				context.stroke();
				context.restore();
			},

			t: function(){
				context.save();
				context.lineWidth = radius*2;
				context.beginPath();
				context.moveTo(radius,radius);
				context.lineTo(radius,canvas.height-radius);
				context.moveTo(radius,canvas.height/2);
				context.lineTo(canvas.width-radius,canvas.height/2);
				context.stroke();
				context.restore();
			},

			v:  function(){
				context.save();
				context.lineWidth = radius*2;
				context.beginPath();
				context.moveTo(radius,radius);
				context.lineTo(canvas.width/2,canvas.height-radius);
				context.lineTo(canvas.width-radius,radius);
				context.stroke();
				context.restore();
			}
		};

	function drawPoints(){
		context.save();	
		context.lineWidth = radius*3;
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
		context.restore();
	}

	function evaluation(shape){
		var
			fullPixels = 0,
			forcedPixels = 0,
			data = null;
		context.clearRect(0,0,canvas.width,canvas.height);
		shapes[shape]();
		data = context.getImageData(0,0,canvas.width,canvas.height);
		for(var i=0,len=data.data.length; i<len; i+= 4){
			if(data.data[i+3] != 0){
				fullPixels += 1;
			}
		}
		forcedPixels = fullPixels;
		context.globalCompositeOperation = 'destination-out';
		drawPoints();
		data = context.getImageData(0,0,canvas.width,canvas.height);
		for(var i=0,len=data.data.length; i<len; i+= 4){
			if(data.data[i+3] != 0){
				forcedPixels -= 1;
			}
		}
		data = null;
		context.globalCompositeOperation = 'source-over';

		if(forcedPixels > pixels){
			pixels = forcedPixels;
			score = Math.floor(forcedPixels/fullPixels*1000)/10;
			result = shape;
		}
	}

	return function (p, r){
		var maxX = 0, maxY = 0, size = 0;

		//reset
		points = p, radius = r, minX = Infinity, minY = Infinity,
		result = '', pixels = 0, score = 0;

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

		context.lineCap = 'round';

		for(var key in shapes){
			evaluation(key);
		}

		return {
			shape: result,
			score: score,
			x: minX,
			y: minY,
			size: size
		};
	};
});