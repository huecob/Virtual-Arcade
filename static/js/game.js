    //set up kaboom window
    kaboom({
        background: [134, 135, 247],
        width: 320,
        height: 240,
        scale: 2,
    });

    //load sprites
    loadRoot("/static/sprites/");
    loadSprite("hero", 'Hero.png');
    loadSprite("badGuys", 'BadBoys.png');
    loadSprite("food", 'strawberry.png');
    loadSprite("block", 'WoodCube.png');
    loadSprite("friend", "Friend.png");
    loadSprite("landing site", "BG1.png");

    //Create levels

    const LEVELS = [
    "                                                                                    ",
    "                                                                                    ",
    "                       #                                                    ^       ",
    "             ============================================         ================= ",
    "      #                                              ================               ",
    "     ===========                                                                    ",
    "                  ==                                                                ",
    "                                      #                                             ",
    "                       ===========================                                  ",
    "                                                                          $         ",
    "==========                                                   =======================",
    "                                                                                    ",
    "          =============                                                             ",
    "                                   ===================                              ",
    "                                                                                    ",
    "      @        ==                            #                                      ",
    "====================================================================================",
];



const levelConf = {
    width: 16,
    height: 16,
    pos: vec2(center()),

    "=": () => [sprite("block"), area(), solid(), "ground"],
    "@": () => [sprite("hero"), area(), solid(), "hero"],
    "#": () => [sprite("badGuys"), area(), solid(), "badGuys"],
    "^": () => [sprite("friend"), area(), solid(), "friend"],
    "$": () => [sprite("food"), area(), solid(), "food"],
};

//create a scene

scene("start", () => {
    add([
        text("Begin Game? :)", {size: 24}),
        pos(vec2(265,200)),
        color(255,255,255),
    ]);

    //this additional text for the title was not being added in
    // add([
    //     text("Artificual Dunderhead", {size: 40}),
    //     pos(vec2(265, -150)),
    //     color(255,255,255),
    // ]);

    onKeyRelease("enter", () => {
        go("game");
    });
});

go("start");

//main game portion

scene("game", (levelNumber = 0) => {

    layers([
        "bg",
        "game",
        "ui",
    ], "game")

    const level = addLevel(LEVELS[levelNumber], levelConf);

    add([sprite("landing site"), pos(center()), layer("bg"), stretch()]);

    add([
        text("Level " + (levelNumber +1), {size: 24}),
        pos(vec2(160,120)),
        color(255,255,255),
        origin("center"),
        layerName("ui"),
        lifespan(1, { fade: 0.5 }),
    ]);

    const player = level.spawn("p", 1, 10);
});


