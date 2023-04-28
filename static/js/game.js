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
loadSprite('snailman', "static/sprites/snailman.png")

loadSound("shoot", 'static/sounds/shoot.wav');
loadSound("explosion", 'static/sounds/explosion.wav')
loadSound("score", '/static/sounds/score.wav')
loadSound("gameover", '/static/sounds/gameover.wav')

scene("game", () => {

	layers(["bg","obj"], "obj")

	add([
		sprite("bg"),
		layer("bg"),
		pos(0,-110),
		scale(1)
	]);


	const MAP_WIDTH = 900;
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
		  "-                                pppppp    -",
		  "-                                          -",
		  "-                                          -",
		  "-                                          -",
		  "-                                          -",
		  "-                                          -",
		  "-             pppp                         -",
		  "-                                          -",
		  "-                                          -",
		  "-                             pppp         -",
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
		],
		p: () => [
		  rect(BLOCK_SIZE, BLOCK_SIZE),
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
	scale(.09),
	rotate(0),
	origin("center"),
	"player",
	{
		shield: 200,
		score: 200,
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
	spawnBullet(player.pos.sub(16,0))
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
const enemyBaseSpeed = 100;
const enemyIncSpeed = 20;

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
			speedY: rand(enemeySpeed * 0.1, 200 * 0.5) * choose([-1,1])
		}
	]);

	wait(newEnemyInterval, spawnEnemies);
}
spawnEnemies();


// this spawns the enemy
// const enemy = add([
// 	sprite("badguys"),
// 	pos(0, rand(0, MAP_HEIGHT -20)),
// 	area(),
// 	scale(0.5),
// 	"enemy",
// 	{
// 		speedX: rand(100 * 0.5, 200 * 1.5) * choose([-1,1]),
// 		speedY: rand(100 * 0.1, 200 * 0.5) * choose([-1,1])
// 	}
// ])

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

onCollide("player", "enemy", (player) => {
	destroy(player);
	makeExplosion(player.pos, 5, 3, 3);
	// play("explosion", {
	// 	volume: 0.08,
	// 	detune: rand(-1200, 1200)
	// })
	play("gameover", {
		volume: 0.4,
		detune: rand(-1200,1200)
	})
})

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
}

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
}

function grow(rate) {
	return {
		update() {
			const n = rate * dt();
			this.scale.x += n;
			this.scale.y += n;
		}
	}
}

onCollide("enemy", "platform", (enemy, platform) => {
	makeExplosion(enemy.pos, 5, 3, 3);
	destroy(enemy);
	play("explosion", {
		volume: 0.08,
		detune: rand(-1200, 1200),
	})
});

onCollide("enemy", "ground", (enemy, ground) => {
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
]);

const scoreText = add([
	text("0000000", {size: 20, font: "sink"}),
	pos(100, 50),
	origin("center"),
])

function updateScore(points) {
	player.score += points;
	scoreText.text = player.score.toString().padStart(6,0);
	play("score", {
		volume: 0.5,
		detune: rand(-1200,1200)
	})
}

add([
	text("%Hacked: ", { size: 20, font: "sink"}),
	pos(300, 30),
	origin("center"),
])

const hackHealth = add([
	rect(52, 12),
	pos(300,50),
	color(100, 100, 100),
	origin("center")
])

const hackHealthHolderInside = add([
	rect(50,10),
	pos(250, 10),
	color(0,0,0),
	origin("center")
]);

const hackHealthBar = add([
	rect(50,10),
	pos(325, 5),
	color(0, 255, 0),
])

});
go("game");

// let's make some enemies (:

