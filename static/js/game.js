kaboom({
	height: 600,
	width: 1000,
}
);

loadSprite("hero", 'static/sprites/hero.png');
loadSprite("badguys", 'static/sprites/badguys.png');
loadSprite("food", 'static/sprites/strawberry.png');
loadSprite("block", 'static/sprites/block.png');
loadSprite("friend", 'static/sprites/friend.png');
loadSprite("bg", "static/sprites/bg.png");
loadSprite('snailman', "static/sprites/snailman.png");
loadSprite('battery', '/static/sprites/battery.png');
loadSprite('startscreen', '/static/sprites/startscreen.png')
loadSprite('healthup', '/static/sprites/healthup.png')
loadSprite('gameover', '/static/sprites/gameover.jpeg')

loadSound("shoot", 'static/sounds/shoot.wav');
loadSound("explosion", 'static/sounds/explosion.wav')
loadSound("score", '/static/sounds/score.wav')
loadSound("gameover", '/static/sounds/gameover.wav')
loadSound("startgamesound", '/static/sounds/startgamesound.wav')
loadSound("startmusic", '/static/sounds/startmusic.mp3')
loadSound("gamemusic", '/static/sounds/gamemusic.mp3')
loadSound("battery", '/static/sounds/battery.wav')
loadSound("timeup", '/static/sounds/timeup.wav')
loadSound("restart", '/static/sounds/restart.mp3')

// loadGif('endscreen', '/static/gifs/endscreen.gif')

//start screen
scene("start", () => {

	const music = play("startmusic");
	music.loop();

	layers(["ui", "bg"], "ui");

	add([
		sprite("startscreen"),
		layer("ui"),
		pos(0,0),
		scale(3.5)
	]);

	add([
		text("Press enter to start", { size: 24 }),
		pos(vec2(450, 150)),
		origin("center"),
		color(255, 255, 255),
		layer("ui")
	]);

	add([
	text("Artificial Dunderhead", { size: 50}),
	pos(vec2(450, 100)),
	origin("center"),
	color(255, 255, 255),
	layer("ui")
	]);

	add([
		text("Controls", { size: 35 }),
		pos(vec2(30,250)),
		origin("left"),
		color(255, 255, 255),
		layer("ui")
	]);

	add([
		rect(300,2 ),
		pos(vec2(30, 262)),
		origin("left"),
		color(255, 255, 255),
		layer("ui")
	])

	add([
		text("Arrow Keys - move A.D. ", { size: 27 }),
		pos(vec2(30, 285)),
		origin("left"),
		color(255, 255, 255),
		layer("ui")
	]);

	add([
		text("Space Bar - shoot ", { size: 27 }),
		pos(vec2(30, 305)),
		origin("left"),
		color(255, 255, 255),
		layer("ui")
	]);

	add([
		text("Up Key - To jump ", { size: 27 }),
		pos(vec2(30, 325)),
		origin("left"),
		color(255, 255, 255),
		layer("ui")
	]);

	add([
		text("*(A.D can jump twice!) ", { size: 15 }),
		pos(vec2(30, 345)),
		origin("left"),
		color(255, 255, 255),
		layer("ui")
	]);

	onKeyRelease("enter", () => {
		music.pause();
		play("startgamesound", {
		volume: 0.3
		})
		wait(1, () => {
			go("game")
		})
	});
});

go("start");


// main game
scene("game", () => {

	//mute function for sound testing w/o bgm
	// onKeyPress("o", () => {
	// 	music.pause();
	// }) 

	const music = play("gamemusic")
	music.loop();

	layers(["bg","obj", "ui"], "obj");

	add([
		sprite("bg"),
		layer("bg"),
		pos(0,-110),
		scale(1),
	]);


	const MAP_WIDTH = 600;
	const MAP_HEIGHT = 325;
	const BLOCK_SIZE = 24;
	
	const map = addLevel(
		[
		  "--------------------------------------------",
		  "-                                          -",
		  "-                                          -",
		  "-                                          -",
		  "-                                          -",
		  "-                                          -",
		  "-                                          -",
		  "-                                          -",
		  "-                                          -",
		  "-                                          -",
		  "-                                pppp      -",
		  "-                                          -",
		  "-                                          -",
		  "-     pppp                                 -",
		  "-                         ppp              -",
		  "-                                          -",
		  "-             pppp                         -",
		  "-                                          -",
		  "-                                          -",
		  "-                               pppp       -",
		  "-                                          -",
		  "-          pp                              -",
		  "-                      ppp                 -",
		  "-                                          -",
		  "============================================",
		  "                                            ",
		],
	  {
		width: BLOCK_SIZE,
		height: BLOCK_SIZE,
		pos: vec2(0,0),
		"=": () => [
		  rect(BLOCK_SIZE, BLOCK_SIZE),
		  color(150, 75, 0),
		  "ground",
		  area(),
		  scale(1),
		  solid(),
		  origin("top")
		],
		p: () => [
		  rect(BLOCK_SIZE, BLOCK_SIZE/2),
		  color(0, 0, 255),
		  "platform",
		  area(),
		  scale(1),
		  solid(),
		],
		"-": () => [
		  rect(BLOCK_SIZE / 10, BLOCK_SIZE),
		  color(0, 0, 0),
		  "boundary",
		  area(),
		  solid(),
		],
	  }
	);

const player = add([
	sprite('hero'),
	pos(400,400),
	body(),
	area(),
	scale(.08),
	rotate(0),
	origin("bot"),
	"player",
	{
		battery: 10,
		score: 0,
	}
]);

//controls for hero, aka tag: "player"

const directions = {
	LEFT: "left",
	RIGHT: "right",
};

let current_direction = directions.RIGHT;

onKeyDown("left", () => {
	player.flipX(-1);
	player.angle = -11;
	current_direction = directions.LEFT;
	player.move(-200, 0);
});

onKeyDown("right", () => {
	player.flipX(1);
	player.angle = 11;
	current_direction = directions.RIGHT;
	player.move(200,0);
});

onKeyRelease("left", () => {
	player.angle = 0;
});

onKeyRelease("right", () => {
	player.angle = 0;
});


let canJump = true;
let canDoubleJump = true;

onKeyPress("up", () => {
  if(player.isGrounded()){
    canJump = true;
    canDoubleJump = true;
  }
  if(canJump && player.isGrounded()) {
    player.jump(600);
    canJump = false;
  } else if(canDoubleJump) {
    player.jump(950*0.5); // smaller jump on the second jump
    canDoubleJump = false;
  }
});

//bullet mechanics

const BULLET_SPEED = 1200;

function spawnBullet(p) {
	let bulletDirection = current_direction === directions.RIGHT ? RIGHT : LEFT;
	add([
		rect(12, 6),
		area(),
		pos(p),
		origin("center"),
		color(127, 127 ,255),
		outline(4),
		"bullet",
		move(bulletDirection, BULLET_SPEED),
		cleanup(),
	])
}

onKeyPress("space", () => {
	spawnBullet(player.pos.add(16,0))
	play("shoot", {
		volume: 0.3,
		detune: rand(-1200,1200),
	})
});

onCollide("bullet", "platform", (bullet) => {
	destroy(bullet)
});

//this sets the properties of the enemies (cont. spawning q"newEnemyInterval)
const enemyBaseSpeed = 200;
const enemyIncSpeed = 30;

function spawnEnemies() {
	let enemyDirection = choose([directions.LEFT, directions.RIGHT]);
	let xpos = (enemyDirection == directions.LEFT ? 0 : MAP_WIDTH);

	const pointsSpeedUp = Math.floor(player.score / 1000);
	const enemeySpeed = enemyBaseSpeed + (pointsSpeedUp * enemyIncSpeed);
	const newEnemyInterval = 0.8 - (pointsSpeedUp / 20);

	add([
		sprite("badguys"),
		pos(xpos, rand(0, MAP_HEIGHT -20)),
		area(),
		scale(0.25),
		"enemy",
		{
			speedX: rand(enemeySpeed * 0.5, 200 * 1.5) * choose([-1,1]),
			speedY: rand(enemeySpeed * 0.1, 200 * 0.5) * choose([-1,1]),
			zpos: 1000,
		}
	]);

	wait(newEnemyInterval, spawnEnemies);
}
spawnEnemies();

// onUpdate("enemy", (enemy) => {
// 	enemy.scale += .15;
// });


//this randomizes the enemy movement but this needs to variable enemy
onUpdate("enemy", (enemy) => {
	enemy.move(enemy.speedX, enemy.speedY);

	if ((enemy.pos.y - enemy.height > MAP_HEIGHT) || (enemy.pos.y < 0)) {
		destroy(enemy);
	}
	if ((enemy.pos.x < -1 * enemy.width) || (enemy.pos.x > MAP_WIDTH)) {
		destroy(enemy);
	}
});

onCollide("player", "enemy", (player, enemy) => {
	shake(20);
	makeExplosion(enemy.pos, 8, 8, 8);
	destroy(enemy);
	play("explosion", {
		volume: 0.4,
		detune: rand(-1200,1200)
	})
	updatePlayerShield(-15);
});

onCollide("enemy", "bullet", (enemy, bullet) => {
	makeExplosion(enemy.pos, 5, 5 ,5);
	destroy(enemy);
	destroy(bullet);
	play("explosion", {
		volume: 0.1,
		detune: rand(0, 1200),
	});
	updateScore(10);
});

function makeExplosion(p, n, rad, size) {
	for (let i =0; i<n; i++) {
		wait(rand(n * 0.1), () => {
			for (let i =0; i<2; i++) {
				add([
					pos(p.add(rand(vec2(-rad), vec2(rad)))),
					rect(1,1),
					color(255,255,255),
					origin("center"),
					scale(1 * size, 1 * size),
					grow(rand(47,72) * size),
					lifespan(0.1),
				]);
			}
		});
	}
};

function lifespan(time) {
	let timer = 0;
	return {
		update() {
			timer += dt();
			if (timer >= time) {
				destroy(this);
			}
		}
	}
};

function grow(rate) {
	return {
		update() {
			const n = rate * dt();
			this.scale.x += n;
			this.scale.y += n;
		}
	}
};

onCollide("enemy", "platform", (enemy, platform) => {
	makeExplosion(enemy.pos, 5, 3, 3);
	destroy(enemy);
	play("explosion", {
		volume: 0.08,
		detune: rand(-1200, 1200),
	})
});

onCollide("enemy", "ground", (enemy) => {
	makeExplosion(enemy.pos, 5, 3, 3);
	destroy(enemy);
	play("explosion", {
		volume: 0.08,
		detune: rand(-1200, 1200),
	})
});

//lets make a score board

add([
	text("SCORE: ", { size: 20, font: "sink"}),
	pos(100, 30),
	origin("center"),
	layer("ui")
]);

const scoreText = add([
	text("0000000", {size: 20, font: "sink"}),
	pos(100, 50),
	origin("center"),
	layer("ui")
]);

function updateScore(points) {
	player.score += points;
	scoreText.text = player.score.toString().padStart(6,0);
	play("score", {
		volume: 0.5,
		detune: rand(-1200,1200)
	})
};

add([
	text("Battery: ", { size: 20, font: "sink"}),
	pos(300, 30),
	origin("center"),
	layer("ui")
]);

add([
	rect(100, 12),
	pos(280,50),
	color(100, 100, 100),
	origin("center"),
	layer("ui")
]);

const battery = add([
	rect(90, 6),
	pos(235, 46.5),
	color(0, 255, 0),
	layer("ui")
])

function healthEffect(p, n, rad, size) {
	for (let i =0; i<n; i++) {
		wait(rand(n * 0.1), () => {
			for (let i =0; i<2; i++) {
				add([
					pos(p.add(rand(vec2(-rad), vec2(rad)))),
					sprite("healthup"),
					color(255,255,255),
					origin("center"),
					scale(1 * size, 1 * size),
					grow(rand(47,72) * size),
					lifespan(0.1),
				]);
			}
		});
	}
};

//timer for game

let time = 15;

add([
	text("COUNTDOWN: ", { size: 20, font: "sink"}),
	pos(500, 30),
	origin("center"),
	layer("ui")
]);

const timeText = add([
	text(`${time}`, {size: 20, font: "sink"}),
	pos(525, 50),
	origin("center"),
	layer("ui"),
	"timer",
]);

function countDown() {
	time -= 1;
	timeText.text = `${time}`;

	if (time === 0) {	
		go("endGame", player.score, time = 15);
		music.pause();
		play("timeup", {
			volume: 0.4,
			detune: rand(-1200, 1200)
		});
	}
};

loop(1, countDown);


//handle player health

function updatePlayerShield(shieldPoints) {
	player.battery += shieldPoints;
	player.battery = Math.max(player.battery, 0);
	player.battery = Math.min(player.battery, 100);

	battery.width = 50 * (player.battery / 100);

	if (player.battery < 20) battery.color = rgb(255, 0, 0);
	else if (player.battery < 50) battery.color = rgb(255, 127, 0);

	if (player.battery <= 0) {
		destroy(player);
		for (let i = 0; i < 500; i++) {
			wait(0.01 * i, () => {
				makeExplosion(vec2(rand(0, MAP_WIDTH), rand(0,MAP_HEIGHT)), 5, 10, 10);
				play("gameover", {
					volume: 0.2,
					detune: rand(-1200, 1200),
				});
			});
		}
		wait(3, () => {
			go("endGame", player.score, time + 4);
			music.pause();
		})
	}
}

//points to collect


onUpdate("food", (food) => {
	food.move(0, food.speed);
	if (food.speed.y - food.height > height()) {
		destroy(food)
	}
});

function spawnPoints() {
	let xpos = rand(BLOCK_SIZE, MAP_WIDTH - BLOCK_SIZE);
	add([sprite("food"), pos(xpos, BLOCK_SIZE), area(), scale(0.3), "food",
	{
		speed: rand(40, 100) 
	}])};

spawnPoints();

const POINTS = 100;

player.onCollide("food", (food) => {
	destroy(food);
	scoreEffect(player.pos, 8, 3, 3);
	updateScore(POINTS);
	wait(1, spawnPoints);
})

function scoreEffect(p, n, rad, size) {
	for (let i =0; i<n; i++) {
		wait(rand(n * 0.1), () => {
			for (let i =0; i<2; i++) {
				add([
					pos(p.add(rand(vec2(-rad), vec2(rad)))),
					circle(1),
					color(255,255,0),
					origin("center"),
					scale(1 * size, 1 * size),
					grow(rand(47,72) * size),
					lifespan(0.1),
				]);
			}
		});
	}
}

//collect health

const HEALTH = 25;

function spawnBattery() {
	let xpos = rand(BLOCK_SIZE, MAP_WIDTH - BLOCK_SIZE);
	add([sprite("battery"), pos(xpos, BLOCK_SIZE), scale(0.019), area(), "battery", 
		{
			speed: rand(10, 120)
		}])
	pos(xpos, BLOCK_SIZE), area()
}

onUpdate("battery", (battery) => {
	battery.move(0, battery.speed);
	if (battery.speed.y - battery.height > height()) {
		destroy(battery)
}});

player.onCollide("battery", (battery) => {
	destroy(battery);
	updatePlayerShield(HEALTH);
	healthEffect(player.pos, 5, 15, .025);
	wait(5, spawnBattery);
	play("battery", {
		volume:0.2,
		detune: rand(-1200, 1200)
	})
});

spawnBattery();

});

// go("game"); for testing sections


//gameover!
scene("endGame", (score, time) => {
	const MAP_WIDTH = 440;
	const MAP_HEIGHT = 275;

	layers(["ui", "bg"], "ui");

	add([
		sprite("gameover"),
		layer("ui"),
		scale(2),
	])

	add([
		text("Game Over", { size: 40, font: "sink" }),
		pos(MAP_WIDTH/2, MAP_HEIGHT/3),
		origin("center"),
		layer("ui")
	]);

	add([
		text(`Score: ${score}`, { size: 40, font: "sink" }),
		pos((MAP_WIDTH/2 - 5), (MAP_HEIGHT/3 + 45)),
		origin("center"),
		layer("ui")
	]);

	add([
		text(`Time: ${time}`, { size: 40, font: "sink" }),
		pos((MAP_WIDTH/2), (MAP_HEIGHT/3 + 90)),
		origin("center"),
		layer("ui")
	]);

	add([
		rect(450, 3),
		pos((MAP_WIDTH/2 + 85), (MAP_HEIGHT/3 + 20)),
		origin("center"),
		layer("ui")
	]);

	add([
		text("Press Enter to Play Again!", { size: 30, font: "sink"}),
		pos((MAP_WIDTH/2 + 155), (MAP_HEIGHT/3 + 270)),
		origin("center"),
		layer("ui")
	]);

onKeyRelease("enter", () => {
	go("start");
	play("restart", {
		volume: 0.3,
		detune: (-1200, 1200)
	});
});

//send data to BE

const formInputs = {
	userScore: score,
	game_id: 1,
	seconds: time,
}

fetch('/scores', {
	method: 'POST',
	body: JSON.stringify(formInputs),
	headers: {
		'Content-Type': 'application/json'
	},
})
.then(response => response.json())
.then(data => console.log(data.message))

});


