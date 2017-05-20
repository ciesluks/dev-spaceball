window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

var game;

window.onload = function() {
    game = new Phaser.Game(1280, 600, Phaser.CANVAS, "gameContainer",
    { preload: preload, create: create, update: update });
}

function preload(){
    game.load.image('red_ship', 'assets/images/red_ship_1.png');
    game.load.image('red_spaceball', 'assets/images/red_spaceball.png');
}

var ships = [];
var spaceball;

function create(){
    game.stage.backgroundColor = "#404040";
    game.physics.startSystem(Phaser.Physics.ARCADE);

    spaceball = game.add.sprite(576, 236, 'red_spaceball');
    game.physics.enable(spaceball, Phaser.Physics.ARCADE);
    spaceball.body.collideWorldBounds = true;
    spaceball.body.bounce.set(1);

    ships[0] = new ship(
        Phaser.Keyboard.A,
        Phaser.Keyboard.D,
        Phaser.Keyboard.W,
        Phaser.Keyboard.S,
        200, 200
    );

    ships[1] = new ship(
        Phaser.Keyboard.LEFT,
        Phaser.Keyboard.RIGHT,
        Phaser.Keyboard.UP,
        Phaser.Keyboard.DOWN,
        400, 400
    );
}

function ship(left, right, up, down, startPosX, startPosY){
    this.sprite = game.add.sprite(startPosX, startPosY, 'red_ship');
    this.sprite.name = 'ship';
    this.sprite.anchor.set(0.5);

    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);

    this.sprite.body.collideWorldBounds = true;
    this.sprite.body.bounce.set(1);
    this.sprite.body.allowRotation = true;

    this.leftKey = left;
    this.rightKey = right;
    this.upKey = up;
    this.downKey = down;
}

function update(){
    game.physics.arcade.collide(ships[0].sprite, ships[1].sprite);
    game.physics.arcade.collide(spaceball, ships[1].sprite);
    game.physics.arcade.collide(spaceball, ships[0].sprite);
    for(i = 0; i < ships.length; i ++){
        moveShip(ships[i]);
    }
}

function moveShip(ship){
    ship.sprite.body.velocity.x = 0;
    ship.sprite.body.velocity.y = 0;
    ship.sprite.body.angularVelocity = 0;

    if (game.input.keyboard.isDown(ship.leftKey))
    {
        ship.sprite.body.angularVelocity = -200;
    }
    else if (game.input.keyboard.isDown(ship.rightKey))
    {
        ship.sprite.body.angularVelocity = 200;
    }

    if (game.input.keyboard.isDown(ship.upKey))
    {
        ship.sprite.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(ship.sprite.angle, 400));
    }
    else if (game.input.keyboard.isDown(ship.downKey))
    {
        ship.sprite.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(ship.sprite.angle, -400));
    }
}
