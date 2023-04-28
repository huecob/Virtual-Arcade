kaboom();

loadSprite("hero", 'static/sprites/hero.png');
loadSprite("badguys", 'static/sprites/badguys.png');
loadSprite("food", 'static/sprites/strawberry.png');
loadSprite("block", 'static/sprites/block.png');
loadSprite("friend", 'static/sprites/friend.png');
loadSprite("bg", "static/sprites/bg.png");
loadSprite('snailman', "static/sprites/snailman.png")

loadSound("shoot", 'static/sounds/shoot.wav');
loadSound("explosion", 'static/sounds/explosion.wav')

scene("game", () => {

	layers(["bg","obj"], "obj")

	add([
		sprite("bg"),
		layer("bg"),
		pos(0,-300),
		scale(2)
	]);


    addLevel([
		"                                    ",
		"                                    ",
		"                                    ",
		"     @                              ",
		"    ================                ",
		"                                    ",
		"                      ==            ",
		"                                    ",
		"       ===============              ",
		"$                               *   ",
		"===        =======    ============= ",
		"                                    ",
		"                                    ",
		"         ===================        ",
		"                                    ",
		"               ==               #   ",
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

//let's make some enemies (:

const ALIEN__BASE_SPEED = 100;
const ALIEN_SPEED_INC = 20;

function spawnAlien() {
  let alienDirection = choose([directions.LEFT, directions.RIGHT]);
  let xpos = (alienDirection == directions.LEFT ? 0 : 500);

  const points_speed_up = Math.floor(player.score / 1000);
  const alien_speed = ALIEN__BASE_SPEED + points_speed_up * ALIEN_SPEED_INC;
  const new_alien_interval = 0.8 - points_speed_up / 20;

  add([
    sprite("badguys"),
    pos(100,100),
    area(),
    "alien",
    {
      speedX:
        rand(alien_speed * 0.5, alien_speed * 1.5) *
        (alienDirection == directions.LEFT ? 1 : -1),
      speedY: rand(alien_speed * 0.1, alien_speed * 0.5) * choose([-1, 1]),
    },
  ]);

  wait(new_alien_interval, spawnAlien);
}

spawnAlien();

onUpdate("alien", (alien) => {
	alien.move(alien.speedX, alien.speedY);
});

onCollide("alien", "bullet", (alien, bullet) => {
	makeExplosion(alien.pos, 5, 5, 5);
	destroy(alien);
	destroy(bullet);
	play("explosion", {
		volume: 0.2,
		detune: rand(0, 1200),
	});
});


});
go("game");