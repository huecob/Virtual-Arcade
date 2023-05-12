kaboom({
	height: 600,
	width: 1000,
    background: [0,0,0]
});

loadSprite("vampire", 'static/sprites/vampire.png')
loadSprite("ghost", '/static/sprites/ghost.png')
loadSprite("bg-day", '/static/sprites/daytime-graveyard.png')
loadSprite("bg-night", '/static/sprites/nightime-graveyard.jpeg')
loadSprite('stone-platform', 'static/sprites/stone-platform.png')
loadSprite('torch', '/static/sprites/torch.png')
loadSprite('fog', '/static/sprites/fog.png')
loadSprite('gg-vamp','/static/sprites/gg-vamp.png')
loadSprite('vamp-points', 'static/sprites/vamp-points.webp')
loadSprite('hearts', 'static/sprites/hearts.png')
loadSprite('bat-lives', '/static/sprites/bat-lives.png')

loadSound('game2-theme', '/static/sounds/game2-theme.mp3')
loadSound('flashlight-click', '/static/sounds/flashlight-click.wav')
loadSound('match', '/static/sounds/match.mp3')
loadSound('ghost-hit', '/static/sounds/ghost-spawn.mp3')
loadSound('bell','/static/sounds/bell.wav')
loadSound('drink', '/static/sounds/drink-points.mp3')

scene("main", () => {

    let music = play('game2-theme');
    music.loop();

    layers(["bg", "ui", "obj"], "obj");

    let currentBG = add([
        sprite("bg-night"),
        layer("bg"),
        pos(0, -300),
        scale(1)
    ]);


    let time = 135

    add([
        text(" seconds until sunrise...", {size: 20, font: "sink"}),
        pos(800, 35),
        origin("center"),
        layer("ui"),
        z(1)
    ])

    const timeText = add([
        text(`${time}`, {size: 20, font: "sink"}),
        pos(600,35),
        origin("center"),
        layer("ui"),
        "timer",
        z(1)
    ]);

    function countDown() {
        time -= 1;
        timeText.text = `${time}`;

        if (time <= 30) {
            currentBG =
            add([
                sprite('bg-day'),
                pos(0,-15),
                scale(0.5),
                layer("bg")
            ])
        }
    }

loop(1, countDown)

//graveyard map

const MAP_WIDTH = 325;
const MAP_HEIGHT = 600;
const BLOCK_SIZE = 24;

const map = addLevel(
    [
        "------------------------------------------------------",
        "-                                                    -",
        "-                                                    -",
        "-                                                    -",
        "-                                                    -",
        "-                                                    -",
        "-                                                    -",
        "-                                                    -",
        "-                                                    -",
        "-                                                    -",
        "-                                                    -",
        "-                                                    -",
        "-                                                    -",
        "-                                                    -",
        "-                                                    -",
        "-                                                    -",
        "-                                                    -",
        "-                                                    -",
        "-                                                    -",
        "-                                                    -",
        "-                                                    -",
        "-                                                    -",
        "-                                                    -",
        "-                                                    -",
        "-                                                    -",
        "-                                                    -",
        "-                                                    -",
        "-                                                    -",
        "-                                         G          -",
        "-                                                    -",
        "======================================================",
        "                                                      ",
    ],
    {
        width: BLOCK_SIZE,
        height: BLOCK_SIZE,
        pos: vec2(0,-200),
        "=": () => [
            rect(BLOCK_SIZE,BLOCK_SIZE),
            color(120, 70, 35),
            "ground",
            area(),
            scale(1),
            solid(),
            origin("center")
        ],
        p: () => [
            sprite('stone-platform'),
            "platform",
            area({ width: 60, height: 7}),
            solid(),
            scale(0.125),
            origin("center"),
        ],
        "-": () => [
            rect(BLOCK_SIZE /10, BLOCK_SIZE),
            color(0, 0, 0),
            "boundary",
            area(),
            solid(),
        ],
    })

const player = add([
    sprite('vampire'),
    pos(400,400),
    body(),
    area(),
    scale(0.03),
    rotate(0),
    origin("bot"),
    "player",
    layer("ui"),
    {
        health: 3,
        score: 0,
    }
])

const fog = add([
    sprite("fog"),
    layer("ui"),
    origin("center"),
    scale(10),
    pos(player.pos),
  ]);

player.onUpdate(() => {
    fog.pos = player.pos;
});

const directions = {
	LEFT: "left",
	RIGHT: "right",
};

let current_direction = directions.RIGHT;

onKeyDown("left", () => {
	player.flipX(1);
	player.angle = -11;
	current_direction = directions.LEFT;
	player.move(-200, 0);
});

onKeyDown("right", () => {
	player.flipX(0);
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

let torch;
let light;

onKeyPress("space", () => {
   torch = add([
        sprite("torch"),
        pos(player.pos.add(30, -40)),
        scale(0.03),
        origin("center"),
        "torch",
        lifespan(3),
    ]);
    light = add([
        circle(100),
        pos(player.pos.add(10,-30)),
        scale(1),
        origin("center"),
        "light",
        lifespan(3),
        layer("bg"),
        area({width: 120, height: 120}),
        color(255,255,0, 0.025),
    ]);
    play("match", {
        volume:0.5,
        detune: rand(-1200,1200)
    });
});

player.onUpdate(() => {

    if (light || torch) {
    torch.pos = player.pos.add(30, -40);
    light.pos = player.pos.add(10,-30);
    }
});

player.onUpdate(() => {
      camPos(player.pos.x, player.pos.y - 225);
});

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

const enemyBaseSpeed = 250;
const enemyIncSpeed = 40;

let enemy;

function spawnEnemies() {
    let enemyDirection = choose([directions.LEFT, directions.RIGHT]);
    let xpos = (enemyDirection == directions.LEFT ? MAP_WIDTH/9 : MAP_WIDTH * 3);

    const pointsSpeedUp = Math.floor(player.score / 1000);
    const enemySpeed = enemyBaseSpeed + (pointsSpeedUp * enemyIncSpeed);
    const newEnemyInterval = 0.8 - (pointsSpeedUp / 20);

    enemy = add([
        sprite('ghost'),
        pos(xpos,rand(0, MAP_HEIGHT-20)),
        area(),
        scale(.25),
        "enemy",
        layer("ui"),
        z(-1),
        origin("center"),
        {
            speedX: rand(enemySpeed * 0.5, 200 * 1.5) * choose([-1,1]),
			speedY: rand(enemySpeed * 0.1, 200 * 0.5) * choose([-1,1]),
			zpos: 1000,
        }
    ]);

    wait(newEnemyInterval, spawnEnemies);
}
spawnEnemies();


onCollide("player", "enemy", (player, enemy) => {
    shake(20);
    makeExplosion(enemy.pos, 8,8,8);
    destroy(enemy);
    play('ghost-hit', {
        volume: 0.5,
        detune: rand(-1200,1200)
    })
    updatePlayerHealth(-1)
})

onUpdate("enemy", (enemy) => {
	enemy.move(enemy.speedX, enemy.speedY);
});

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
	play("drink", {
		volume: 0.5,
		detune: rand(-1200,1200)
	})
};

add([
	text("Lives", { size: 20, font: "sink"}),
	pos(290, 30),
	origin("center"),
	layer("ui")
]);

const batlife1 = add([
    sprite('bat-lives'),
    origin("center"),
    scale(0.075),
    layer("ui"),
    'bat-lives1',
    pos(180 + 75 ,  65)
]);

const batlife2 = add([
    sprite('bat-lives'),
    origin("center"),
    scale(0.075),
    layer("ui"),
    'bat-lives$2',
    pos(180 + ( 2 * 75 ),  65)
])

const batlife3 = add([
    sprite('bat-lives'),
    origin("center"),
    scale(0.075),
    layer("ui"),
    'bat-lives3',
    pos(180 + ( 3 * 75 ),  65)
])

function grow(rate) {
	return {
		update() {
			const n = rate * dt();
			this.scale.x += n;
			this.scale.y += n;
		}
	}
};

function makeExplosion(p, n, rad, size) {
	for (let i =0; i<n; i++) {
		wait(rand(n * 0.1), () => {
			for (let i =0; i<2; i++) {
				add([
					pos(p.add(rand(vec2(-rad), vec2(rad)))),
					rect(1,1),
					color(190,10,0),
					origin("center"),
					scale(1 * size, 1 * size),
					grow(rand(47,72) * size),
					lifespan(0.1),
				]);
			}
		});
	}
};


function updatePlayerHealth(health) {
    player.health += health;
    player.heatlh = Math.max(player.health, 0);
    player.health = Math.min(player.health, 3);

    if (player.health === 2) {
        destroy(batlife3);
    } else if (player.health === 1) {
        destroy(batlife2);
    } else if (player.health === 0) {
        destroy(batlife1);
    }

    if (player.heatlh <= 0) {
        destroy(player)
        for (let i = 0; i < 500; i++) {
			wait(0.01 * i, () => {
				makeExplosion(vec2(rand(0, MAP_WIDTH), rand(0,MAP_HEIGHT)), 5, 10, 10);
				play("bell", {
					volume: 0.7,
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

// function spawnPoints() {
//     let xpos = rand(0, 850);
//     add([sprite('vamp-points'), pos(xpos, 100), scale(0.4), area(), layer("ui"), body(), "points"]);
// }

// onUpdate("points", (p) => {
//     if (p.pos.y > MAP_HEIGHT) {
//         destroy(p);
//         spawnPoints();
//     }
// })

// spawnPoints();

let vampPoints;
const pointsBaseSpeed = 300;
const pointsIncSpeed = 60;

function spawnPoints() {
    let pointsDirection = choose([directions.LEFT, directions.RIGHT]);
    let xpos = (pointsDirection == directions.LEFT ? MAP_WIDTH/9 : MAP_WIDTH * 3);

    const pointsSpeedUp = Math.floor(player.score / 1000);
    const pointsSpeed = pointsBaseSpeed + (pointsSpeedUp * enemyIncSpeed);
    const newPointsInterval = 2 - (pointsSpeedUp / 20);

    vampPoints = add([
        sprite('vamp-points'),
        pos(xpos,rand(0, MAP_HEIGHT-20)),
        area(),
        scale(.35),
        "points",
        layer("ui"),
        z(-1),
        origin("center"),
        {
            speedX: rand(pointsSpeed * 0.5, 200 * 1.5) * choose([-1,1]),
			speedY: rand(pointsSpeed * 0.1, 200 * 0.5) * choose([-1,1]),
			zpos: 1000,
        }
    ]);

    wait(newPointsInterval, spawnPoints);
}
spawnPoints();

onUpdate("points", (points) => {
	points.move(points.speedX, points.speedY);
});

const basepoints = 100;

player.onCollide("points", (points) => {
    destroy(points);
    add([
        sprite("hearts"),
        pos(player.pos.add(0,-115)),
        origin("center"),
        scale(0.15),
        lifespan(0.1)
    ]);
    wait(1,spawnPoints);
    updateScore(basepoints);
});

});

go("main");

scene("endGame", () => {
	const MAP_WIDTH = 440;
	const MAP_HEIGHT = 275;

	layers(["ui", "bg"], "ui");

	add([
		sprite("gg-vamp"),
		layer("ui"),
		scale(1.3),
	])

	add([
		text("Game Over", { size: 40, font: "sink" }),
		pos(MAP_WIDTH/2, MAP_HEIGHT/3),
		origin("center"),
		layer("ui")
	]);

	// add([
	// 	text(`Score: ${score}`, { size: 40, font: "sink" }),
	// 	pos((MAP_WIDTH/2 - 5), (MAP_HEIGHT/3 + 45)),
	// 	origin("center"),
	// 	layer("ui")
	// ]);

	// add([
	// 	text(`Time: ${time}`, { size: 40, font: "sink" }),
	// 	pos((MAP_WIDTH/2), (MAP_HEIGHT/3 + 90)),
	// 	origin("center"),
	// 	layer("ui")
	// ]);

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
});

// go("endGame")