//緩沖計算

SW.define('modules/ease', function(require, exports, module){

	var Ease = {

		linear: function( percent ){
			return percent;
		},

		quadIn: function( percent ){
			return Math.pow( percent, 2 );
		},

		quadOut: function( percent ){
			return Math.pow( percent - 1, 2 ) + 1;
		},

		cubicIn: function( percent ){
			return Math.pow( percent, 3 );
		},

		cubicOut: function( percent ){
			return Math.pow( percent - 1, 3 ) + 1;
		},

		quartIn: function( percent ){
			return Math.pow( percent, 4 );
		},

		quartOut: function( percent ){
			return Math.pow( percent - 1, 4 ) + 1;
		},

		quintIn: function( percent ){
			return Math.pow( percent, 5 );
		},

		quintOut: function( percent ){
			return Math.pow( percent - 1, 5 ) + 1;
		}

	};

	return function( ease, percent ){
		switch( ease.toLowerCase().replace(/\s/g,'') ){

			case 'quadin':
				return Ease.quadIn( percent );

			case 'quadout':
				return Ease.quadOut( percent );

			case 'quadinout':
				if(percent>0.5){
					return Ease.quadOut(percent);
				}
				return Ease.quadIn(percent);

			case 'cubicin':
				return Ease.cubicIn( percent );

			case 'cubicout':
				return Ease.cubicOut( percent );

			case 'cubicinout':
				if(percent>0.5){
					return Ease.cubicOut(percent);
				}
				return Ease.cubicIn(percent);

			case 'quartin':
				return Ease.quartIn( percent );

			case 'quartout':
				return Ease.quartOut( percent );

			case 'quartinout':
				if(percent>0.5){
					return Ease.quartOut(percent);
				}
				return Ease.quartIn(percent);

			case 'quintin':
				return Ease.quintIn( percent );

			case 'quintout':
				return Ease.quintOut( percent );

			case 'quintinout':
				if(percent>0.5){
					return Ease.quintOut(percent);
				}
				return Ease.quintIn(percent);

			default:
				return Ease.linear( percent );

		}
	};

});