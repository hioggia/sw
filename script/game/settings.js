//遊戲配置

SW.define('game/settings', {

	width: 960,
	height: 640,
	fps: 30,
	font: '40px sans-serif',
	paintWidth: 15,

	evaluation: {
		imgUrl: 'image/evaluation.png',
		size: 256,
		leastScore: 50,
		target: {
			x: 40,
			y: 80,
			size: 64,
			gap: 12,
			time: 3
		},
		shapes: {
			'square': 0,
			'round': 1,
			'cross': 2,
			'triangle': 3
		}
	},

	player: {
		y: 400,
		width: 286,
		height: 180,
		imgUrl: 'image/player.png',
		sprites: {
			'idle': [0],
			'run': [0],
			'back': [0],
			'fire': [0,1,0,1]
		},
		frameTime: 0.05,

		speed: 80,
		atk: 100,
		hp: 5000,
		cd: 0.5,
		range: 100
	},

	emeny1: {
		y: 260,
		width: 400,
		height: 400,
		imgUrl: 'image/emeny1.png',
		sprites: {
			'idle': [3,4,5,6,7,8],
			'run': [3],
			'back': [3],
			'fire': [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,0,1,2]
		},
		frameTime: 0.05,

		speed: 20,
		atk: 20,
		hp: 1000,
		cd: 1,
		range: 100,
		vision: 400
	},

	emeny2: {
		y: 220,
		width: 400,
		height: 400,
		imgUrl: 'image/emeny2.png',
		sprites: {
			'idle': [3,4,5,6,7,8],
			'run': [3],
			'back': [3],
			'fire': [0,1,2]
		},
		frameTime: 0.05,

		speed: 30,
		atk: 50,
		hp: 20000,
		cd: 1,
		range: 120,
		vision: 400
	}

});