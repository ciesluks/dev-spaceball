var game;

window.onload = function() {
    game = new Phaser.Game(1280, 600, Phaser.CANVAS, "gameContainer",
    { preload: preload, create: create, update: update, render: render });
}

function preload(){
    game.load.image('red_ship_1', 'assets/images/red_ship_1.png');
    game.load.image('green_ship_2', 'assets/images/green_ship_2.png');
    game.load.image('red_spaceball', 'assets/images/red_spaceball.png');
    game.load.image('green_bullet', 'assets/images/green_bullet.png');
    game.load.physics('physicsData', './assets/polygons/polygons.json');
}

var ships = [];
var spaceball;
var goalLeft;
var goalRight;

function create(){
    game.time.advancedTiming = true;
    game.stage.backgroundColor = "#404040";

    //	Enable p2 physics
  	game.physics.startSystem(Phaser.Physics.P2JS);

    //  Make things a bit more bouncey
    game.physics.p2.defaultRestitution = 0.8;

    ships[0] = new ship(
        Phaser.Keyboard.A,
        Phaser.Keyboard.D,
        Phaser.Keyboard.W,
        Phaser.Keyboard.S,
        180, 300,
        'red_ship_1'
    );

    ships[1] = new ship(
        Phaser.Keyboard.LEFT,
        Phaser.Keyboard.RIGHT,
        Phaser.Keyboard.UP,
        Phaser.Keyboard.DOWN,
        1100, 300,
        'green_ship_2'
    );

    spaceball = game.add.sprite(640, 300, 'red_spaceball');
  	game.physics.p2.enable(spaceball, false);
  	spaceball.body.clearShapes();
  	spaceball.body.loadPolygon('physicsData', 'red_spaceball');
    spaceball.body.mass = 0.2;

    goalLeft = game.add.sprite(0, 300, null);
    game.physics.p2.enable(goalLeft, true);
    goalLeft.body.setRectangle(10, 200);
    goalLeft.body.static = true;
    goalRight = game.add.sprite(game.width, 300, null);
    game.physics.p2.enable(goalRight, true);
    goalRight.body.setRectangle(10, 200);
    goalRight.body.static = true;

    spaceball.body.createBodyCallback(goalLeft, resetGame, this);
    spaceball.body.createBodyCallback(goalRight, resetGame, this);
    game.physics.p2.setImpactEvents(true);

    var ballMaterial = game.physics.p2.createMaterial('ballMaterial', spaceball.body);
    var worldMaterial = game.physics.p2.createMaterial('worldMaterial');

    //  4 trues = the 4 faces of the world in left, right, top, bottom order
    game.physics.p2.setWorldMaterial(worldMaterial, true, true, true, true);

    //  Here is the contact material. It's a combination of 2 materials, so whenever shapes with
    //  those 2 materials collide it uses the following settings.
    //  A single material can be used by as many different sprites as you like.
    var contactMaterial = game.physics.p2.createContactMaterial(ballMaterial, worldMaterial);

    contactMaterial.friction = 0.3;     // Friction to use in the contact of these two materials.
    contactMaterial.restitution = 1.0;  // Restitution (i.e. how bouncy it is!) to use in the contact of these two materials.
    contactMaterial.stiffness = 1e7;    // Stiffness of the resulting ContactEquation that this ContactMaterial generate.
    contactMaterial.relaxation = 3;     // Relaxation of the resulting ContactEquation that this ContactMaterial generate.
    contactMaterial.frictionStiffness = 1e7;    // Stiffness of the resulting FrictionEquation that this ContactMaterial generate.
    contactMaterial.frictionRelaxation = 3;     // Relaxation of the resulting FrictionEquation that this ContactMaterial generate.
    contactMaterial.surfaceVelocity = 0;        // Will add surface velocity to this material. If bodyA rests on top if bodyB, and the surface velocity is positive, bodyA will slide to the right.

}

function ship(left, right, up, down, startPosX, startPosY, ship_sprite){
    this.sprite = game.add.sprite(startPosX, startPosY, ship_sprite);
    game.physics.p2.enable(this.sprite, false);
    this.sprite.body.clearShapes();
  	this.sprite.body.loadPolygon('physicsData', ship_sprite);

    this.leftKey = left;
    this.rightKey = right;
    this.upKey = up;
    this.downKey = down;
}

function update(){
    for (i = 0; i < ships.length; i ++){
        moveShip(ships[i]);
    }
}

function resetGame(ball, goal){
    game.state.restart();
}

function moveShip(ship){
    if (game.input.keyboard.isDown(ship.leftKey)){
        ship.sprite.body.angularVelocity = -5;
    }
    else if (game.input.keyboard.isDown(ship.rightKey)){
        ship.sprite.body.angularVelocity = 5;
    }
    else {ship.sprite.body.setZeroRotation();}

    if (game.input.keyboard.isDown(ship.upKey)){
        ship.sprite.body.thrust(1000);
    }
    else if (game.input.keyboard.isDown(ship.downKey)){
        ship.sprite.body.reverse(800);
    }
    else {ship.sprite.body.damping = 0.8;}
}

function render() {
    game.debug.text(game.time.fps, 2, 14, "#00ff00");
}
