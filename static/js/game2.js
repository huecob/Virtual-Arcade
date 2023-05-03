kaboom({
	height: 600,
	width: 1000,
});

loadSprite("vampire", 'static/sprites/vampire.png')
loadSprite("ghost", '/static/sprites/ghost.png')
loadSprite("bg-day", '/static/sprites/daytime-graveyard.png')
loadSprite("bg-night", '/static/sprites/nightime-graveyard.jpeg')
loadSprite('stone-platform', 'static/sprites/stone-platform.png')

loadSound('game2-theme', '/static/sounds/game2-theme.mp3')

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
    ])

    const timeText = add([
        text(`${time}`, {size: 20, font: "sink"}),
        pos(600,35),
        origin("center"),
        layer("ui"),
        "timer"
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
        "-          ppp                             -",
        "-                                          -",
        "-                       ppp                -",
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
            area(),
            // solid(),
            scale(0.125),
            origin("center")
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


// const flashLight = add([
//     rect(100,20),
//     polygon([vec2(50,-80), vec2(0,0), vec2(100,0)]),
//     origin("center"),
//     color(255,255,0),
//     attach(player, {offset: vec2(0,-40)}),
// ]);

function shineFlashight(p) {
    let flashLightDirection = current_direction === directions.RIGHT ? RIGHT : LEFT;
    add([
        rect(100,20),
        drawPolygon(
            { pts: [vec2(50,-80), 
                vec2(0,0), 
                vec2(100,0)]}),
        pos(p),
        origin("center"),
        color(255,255,0),
        outline(4),
        "flashlight",
        move(flashLightDirection, 0),
    ])
}

onKeyDown("space", () => {
    shineFlashight(player.pos.add(16,0))
})




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

function spawnEnemies() {
    let enemyDirection = choose([directions.LEFT, directions.RIGHT]);
    let xpos = (enemyDirection == directions.LEFT ? MAP_WIDTH/9 : MAP_WIDTH * 3);

    const pointsSpeedUp = Math.floor(player.score / 1000);
    const enemeySpeed = enemyBaseSpeed + (pointsSpeedUp * enemyIncSpeed);
    const newEnemyInterval = 0.8 - (pointsSpeedUp / 20);

    let enemy = add([
        sprite('ghost'),
        pos(xpos,rand(0, MAP_HEIGHT-20)),
        area(),
        scale(.25),
        "enemy",
        layer("ui"),
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

onUpdate("enemy", (enemy) => {
	enemy.move(enemy.speedX, enemy.speedY);
});

});

go("main");