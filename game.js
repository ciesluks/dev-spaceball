window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

var game;

window.onload = function() {
    game = new Phaser.Game(1224, 600, Phaser.CANVAS, "gameContainer",
    { preload: preload, create: create, update: update });
}

function preload(){
    game.load.image('maze_wall', 'assets/images/maze_wall.png');
    game.load.image('maze_floor', 'assets/images/maze_floor.png');
}

var ships = [];
var ball;

function create(){
    game.stage.backgroundColor = "#404040";
    game.physics.startSystem(Phaser.Physics.ARCADE);

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
    this.sprite = game.add.sprite(startPosX, startPosY, 'maze_wall');
    this.sprite.name = 'ship';
    this.sprite.anchor.set(0.5);

    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);

    this.sprite.body.collideWorldBounds = true;
    this.sprite.body.bounce.set(0.8);
    this.sprite.body.allowRotation = true;
    this.sprite.body.immovable = true;

    this.leftKey = left;
    this.rightKey = right;
    this.upKey = up;
    this.downKey = down;
}

function update(){
    for(i = 0; i < ships.length; i ++){
        moveShip(ships[i]);
    }
}

function moveShip(ship){
    ship.sprite.body.velocity.x = 0;
    ship.sprite.body.velocity.y = 0;
    ship.sprite.body.angularVelocity = 0;

    if (game.input.keyboard.isDown(ship.leftKey)
    {
        ship.sprite.body.angularVelocity = -200;
    }
    else if (game.input.keyboard.isDown(ship.rightKey)
    {
        ship.sprite.body.angularVelocity = 200;
    }

    if (game.input.keyboard.isDown(ship.upKey)
    {
        ship.sprite.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(ship.sprite.angle, 300));
    }
}
