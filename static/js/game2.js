kaboom({
	height: 600,
	width: 1000,
});

loadSprite("vampire", 'static/sprites/vampire.png')
loadSprite("ghost", '/static/sprites/ghost.png')
loadSprite("bg-day", '/static/sprites/daytime-graveyard.png')
loadSprite("bg-night", '/static/sprites/nightime-graveyard.jpeg')
loadSprite('stone-platform', 'static/sprites/stone-platform.png')
loadSprite('torch', '/static/sprites/torch.png')
loadSprite('fog', '/static/sprites/fog.png')
loadSprite('gg-vamp','/static/sprites/gg-vamp.png')
loadSprite('vamp-points', 'static/sprites/vamp-points.png')
loadSprite('hearts', 'static/sprites/hearts.png')

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
        pos(0, .8),
        scale(0.58)
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
        "-                                          -",
        "-                                          -",
        "-                                          -",
        "-                                          -",
        "-                                          -",
        "-                                          -",
        "-                                          -",
        "-                                          -",
        "-                                          -",
        "-                                          -",
        "-                                          -",
        "-                                          -",
        "-                                          -",
        "-                                          -",
        "============================================",
        "                                            ",
    ],
    {
        width: BLOCK_SIZE,
        height: BLOCK_SIZE,
        pos: vec2(0,0),
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
        blood: 100,
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
    ])
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
    ]),
    play("match", {
        volume:0.5,
        detune: rand(-1200,1200)
    })
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
    const enemeySpeed = enemyBaseSpeed + (pointsSpeedUp * enemyIncSpeed);
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
            speedX: rand(enemeySpeed * 0.5, 200 * 1.5) * choose([-1,1]),
			speedY: rand(enemeySpeed * 0.1, 200 * 0.5) * choose([-1,1]),
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
    updatePlayerBlood(-20)
})

onUpdate("enemy", (enemy) => {
	enemy.move(enemy.speedX, enemy.speedY);
});

onCollide("light", "enemy", (light, enemy) => {
    let dir = light.pos.sub(enemy.pos).unit();
    enemy.move(dir.scale(-100));
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
	text("Blood: ", { size: 20, font: "sink"}),
	pos(290, 30),
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

const blood = add([
	rect(90, 6),
	pos(235, 46.5),
	color(170, 10, 0),
	layer("ui")
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

function updatePlayerBlood(bloodPoints) {
	player.blood += bloodPoints;
	player.blood = Math.max(player.blood, 0);
	player.blood = Math.min(player.blood, 100);

	blood.width = 50 * (player.blood / 100);

	if (player.blood < 20) blood.color = rgb(255, 0, 0);
	else if (player.blood < 50) blood.color = rgb(255, 127, 0);

	if (player.blood <= 0) {
		destroy(player);
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

function spawnPoints() {
    let xpos = rand(0, 850);
    add([sprite('vamp-points'), pos(xpos, 100), scale(0.025), area(), layer("ui"), body(), "points"]);
}

onUpdate("points", (p) => {
    if (p.pos.y > MAP_HEIGHT) {
        destroy(p);
        spawnPoints();
    }
})

spawnPoints();

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