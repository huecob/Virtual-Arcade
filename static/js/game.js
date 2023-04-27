kaboom();

loadSprite("hero", 'static/sprites/hero.png');
loadSprite("badGuys", 'static/sprites/badguys.png');
loadSprite("food", 'static/sprites/strawberry.png');
loadSprite("block", 'static/sprites/block.png');
loadSprite("friend", 'static/sprites/friend.png');
loadSprite("bg", "static/sprites/bg.png");

loadSound("shoot", 'static/sounds/shoot.wav');

scene("game", () => {

	layers(["bg","obj"], "obj")

	add([
		sprite("bg"),
		layer("bg"),
		pos(0,-600),
		scale(2)
	]);

	

    addLevel([
		"                                    ",
		"                                    ",
		"                                    ",
		"     @    ^                         ",
		"    ================                ",
		"                                    ",
		"                        ==          ",
		"                                    ",
		"       ===============              ",
		"$                               *   ",
		"===        =======    ============= ",
		"                                    ",
		"                                    ",
		"         ===================        ",
		"                                     ",
		"               ==         #         ",
		"====================================",
	], {
		width: 53,
		height: 50,

			"=": () => [
				sprite('block'),
				area(),
				scale(0.1),
				"platform",
				solid(),
			],
			"@": () => [
				sprite('friend'),
				area(),
				pos(0,-60),
				scale(0.08),
			],
			"$": () => [
				sprite('food'),
				area(),
				scale(0.175)
			],
		});

const player = add([
	sprite('hero'),
	pos(110,800),
	body(),
	area(),
	scale(.045),
	rotate(0),
	origin("center"),
	"player"
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
	player.move(-100, 0);
});

onKeyDown("right", () => {
	player.flipX(1);
	player.angle = 11;
	current_direction = directions.RIGHT;
	player.move(100,0);
});

onKeyRelease("left", () => {
	player.angle = 0;
});

onKeyRelease("right", () => {
	player.angle = 0;
});

let jumpCount = 0;

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

});
go("game");
