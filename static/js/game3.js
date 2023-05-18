kaboom({
	height: 600,
	width: 1000,
    background: [0,0,0]
});

loadSprite('game3-bg1', 'static/sprites/game3-bg1.png')
loadSprite('game3-bg2', 'static/sprites/game3-bg2.png')
loadSprite('game3-bg3', 'static/sprites/game3-bg3.png')
loadSprite('game3-bg4', 'static/sprites/game3-bg4.png')
loadSprite('game3-bg5', 'static/sprites/game3-bg5.png')
loadSprite('speech-bubble', 'static/sprites/speech-bubble.png')
loadSprite('sleeping-emoji','static/sprites/Sleeping Emoji.png')

loadSprite('player', 'static/sprites/game3-player.png')

loadSound('alarm-sound', 'static/sounds/alarm-sound.wav')
loadSound('die-forelle', 'static/sounds/die-forelle.mp3')
loadSound('reverie', 'static/sounds/Debussy - Rêverie.mp3')

scene("start", () => {

    const music = play('reverie', {
        volume: 0.5
    });
    music.loop();

    layers(["bg","ui"], "ui");

    add([
        text("Responsibility Rain", { size: 50}),
        pos(width()/2,height()/4),
        origin("center"),
        layer("ui")
        ]);

    	add([
            text("Press enter to start\n(to hit snooze)", { size: 24 }),
            pos(width()/2, height()/2),
            origin("center"),
            color(255, 255, 255),
            layer("ui")
        ]);

    function spawnEffect() {
        let xpos = rand(0,width());
        add([sprite("sleeping-emoji"), pos(xpos, 0), area(), scale(0.3), "effect", layer("bg"),
            {
                speed: rand(40, 100) 
            }
        ])
    };
    spawnEffect();
    loop(3,spawnEffect)

        onUpdate("effect", (effect) => {
            effect.move(0, effect.speed);
            if (effect.speed.y - effect.height > height()) {
                destroy(effect)
        }});

    onKeyDown("enter", () => {
        music.pause();
        go("main");
    });

})
go("start")

scene("main", () => {

    const music = play('die-forelle', {
        volume: 0.5,
    });
    music.loop();

layers(["bg", "ui", "obj"], "obj");

const bgs =
    [
        [
            sprite('game3-bg1'),
            pos(0,300),
            origin("left"),
            scale(0.57),
            layer("bg")
        ],

        [
            sprite('game3-bg2'),
                pos(0,300),
                origin("left"),
                scale(0.75),
                layer("bg")
        ],

        [
            sprite('game3-bg3'),
                    pos(0,300),
                    origin("left"),
                    scale(0.57),
                    layer("bg")
        ],

        [
            sprite('game3-bg4'),
                        pos(0,300),
                        origin("left"),
                        scale(0.57),
                        layer("bg")
        ],

        [
            sprite('game3-bg5'),
                            pos(0,300),
                            origin("left"),
                            scale(1),
                            layer("bg")
        ]
    ]

const currentBg = add(choose(bgs));

gravity = 2400;

const responsibilities = ["Dishes","Trash","Laundry","Vaccuming","Dusting",
                            "Homework","Groceries","Taxes","JuryDuty","Work",
                            "Exercise","Reading","Dentist","Errands","Study",
                            "Fold","Wash","Walk"]


const luxuries = ["Sleeping-In","Hiking","Video Games","Reality TV","Bubble Bath",
                    "Vacation", "Hawaii", "Fresh Rice", "Swimming","Pet Snuggles"]

const resonsibilitySpeed = 120
const playerSpeed = 400
    
function grow(rate) {
    return {
        update() {
            const n = rate * dt()
            this.scale.x += n
            this.scale.y += n
        },
    }
}

function late(t) {
    let timer = 0
    return {
        add() {
            this.hidden = true
        },
        update() {
            timer += dt()
            if (timer >= t) {
                this.hidden = false
            }
        },
    }
}

add([
    text("AVOID", { size: 160 }),
    pos(width() / 2, height() / 2),
    origin("center"),
    lifespan(1),
    fixed(),
    scale(0.5)
])

add([
    text("THE", { size: 80 }),
    pos(width() / 2, height() / 2),
    origin("center"),
    lifespan(2),
    late(1),
    fixed(),
    scale(0.5)
])

add([
    text("RESPONSIBILITIES!", { size: 120 }),
    pos(width() / 2, height() / 2),
    origin("center"),
    lifespan(4),
    scale(0.5),
    late(2),
    fixed(),
]);

const player = add([
    sprite('player'),
    pos(500,535),
    origin("center"),
    scale(.5),
    area(),
    "player",
    {
        score: 0
    }
]);

const directions = {
	LEFT: "left",
	RIGHT: "right",
};

let current_direction = directions.RIGHT;

onKeyDown("left", () => {
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

//hiding tiles will be 205 difference in widgth, 90 in height
//account for w/5, h/8,

let startingX = 0;
let startingY = 0;
const tileWidth = width() / 5;
const tileHeight = height() / 8;

for (let row = 0; row < 5; row++) {
  for (let col = 0; col < 8; col++) {
    add([
      rect(tileWidth, tileHeight),
      layer("ui"),
      pos(startingX + row * tileWidth, startingY + col * tileHeight),
      color(rand(0,255), rand(0,255), rand(0,255)),
      "tile"
    ]);
  }
};

const responsibilitySpeed = 120;

function destroyRandomTile() {
    const tiles = get("tile");

    if (tiles.length === 0) {
        responsibilitySpeed = 150
    }

    const randomTile = tiles[Math.floor(Math.random() * tiles.length)];

    destroy(randomTile);
}

function spawnResponsibilities() {
    add([
        text(choose(responsibilities), { size: 20 }),
        rotate(90),
        area(),
        color(0,0,0),
        pos(rand(0, width()), 0),
        origin("bot"),
        "responsibilities",
        "enemy",
        { speed: rand(responsibilitySpeed * 0.5, responsibilitySpeed * 1.5) },
    ])
    wait(2, spawnResponsibilities);
}

spawnResponsibilities();

player.onCollide("enemy", (enemy) => {
    destroy(enemy)
    shake(20)
    updateScore(-100)
})

const luxurySpeed = 120;

function spawnLuxuries() {
    add([
        text(choose(luxuries), { size: 25 }),
        rotate(90),
        area(),
        color(50,205,50),
        pos(rand(0, width()), 0),
        origin("bot"),
        "points",
        "points",
        { speed: rand(luxurySpeed * 0.5, luxurySpeed * 1.5) },
    ])
    wait(2, spawnLuxuries);
}

spawnLuxuries();

onUpdate("responsibilities", (r) => {
    r.move(0, r.speed);
    if (r.pos.y - r.height > height() +50) {
        destroy(r)
    }
});

onUpdate("points", (p) => {
    p.move(0, p.speed);
    if (p.pos.y - p.height > height() +50) {
        destroy(p)
    }
});

let time = 130
    
add([
    text(" before alarm goes off...", {size: 20}),
    pos(840, 35),
    origin("center"),
    layer("ui"),
]);
    
    const timeText = add([
        text(`${time}`, {size: 20}),
        pos(665,35),
        origin("center"),
        layer("ui"),
        "timer",
        z(1)
    ]);

    function countDown() {
        time -= 1;
        timeText.text = `${time}`;
    
        if (time === 0) {
            player('alarm-sound', {
                volume:0.5,
                detune: rand(-1200,1200)
            });
            music.pause();
            go("end", player.score)
        }
    }
    loop(1, countDown);

const POINTS = 100;

function updateScore(points) {

    player.score += points;
    scoreText.text = player.score.toString().padStart(6,0);

    if (player.score % 100 == 0) {
        destroyRandomTile();
    };


};

const scoreText = add([
    text("0000000", {size: 20 }),
    pos(100, 50),
    origin("center"),
    layer("ui")
]);

add([
    text("Fulfillment", {size: 20}),
    pos(100, 35),
    origin("center"),
    layer("ui")
]);

player.onCollide("points", (points) => {
    destroy(points);
    updateScore(POINTS);
});

});

// go("main");

scene("end", (score) => {

    layers(["bg", "ui"], "ui");

    const morningAffirmations = [
        "I woke up on the right side of the bed!",
        "I had the nicest dream...",
        "Having a good day aren't ya?",
        "Best day ever!"
    ]

    const morningComplaints = [
        "Ugh... ",
        "Gonna need a cup of joe... or three...",
        "*Hit Snooze*",
        "Not today...",
        "... "
    ]

    add([
		text("Time to wake up...", { size: 40 }),
		pos(width()/2,height()/2 - 150),
		origin("center"),
		layer("ui")
	]);

    add([
		text(`Mood today: ${score}`, { size: 35 }),
		pos(width()/2,height()/2 -100),
		origin("center"),
		layer("ui")
	]);

    add([
        text(choose(morningAffirmations), { size: 20 }),
        pos(width()/2,height()/2 + 170),
        origin("center"),
        layer("ui")
    ]);

    const player = add([
        sprite('player'),
        pos(500,535),
        origin("center"),
        scale(.5),
    ]);

    const formInputs = {
        userScore: score,
        game_id: 3,
        seconds: 130,
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

})

// go("end")