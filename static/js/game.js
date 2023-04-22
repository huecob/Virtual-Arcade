import kaboom from kaboom

kaboom();

// loadSprite('badBoys', 'static/sprites/BadBoys.png');
loadSprite('hero', 'static/sprites/Hero.png');
loadSprite('friend', 'static/sprites/Friend.png');


// add things to the screen + where
// be specific about the things, like size, does it need to account for gravity? 


const hero = add([
    sprite("hero"),
    pos(500, 465),
    scale(0.15),
    area(),
    body(),
])


//add some control layers by setting variables to our sprite rendering functions

onKeyPress("space", () => {
    if (hero.isGrounded()) {
    hero.jump();
    }
});