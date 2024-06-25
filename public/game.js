let playerId;
const socket = io();

socket.on('player id', (id) => {
    playerId = id;
    console.log('Assigned player ID:', playerId);
});

let gameScene = new Phaser.Scene('Game');

gameScene.preload = function () {
    this.load.image('background', 'assets/Space_Drop.png');
    this.load.image('bat', 'assets/bat_alpha.png');
    this.load.image('ball', 'assets/world_earth.png');
};

gameScene.create = function () {
    let bg1 = this.add.image(300, 450, 'background');
    bg1.setScale(1 / 2.7);
    let bg2 = this.add.image(900, 450, 'background').setFlipX(true);
    bg2.setScale(1 / 2.7);

    this.bat1 = this.matter.add.image(600, 80, 'bat');
    this.bat1.setScale(1 / 17);
    this.bat1.setTrapezoid(15, 110, 0.9, { chamfer: { radius: 3 } });
    this.bat1.setFrictionAir(0.1);
    this.bat1.setBounce(1);
    this.bat1.setMass(1);
    this.bat1.setInteractive();

    this.bat1.setDisplayOrigin(126.64296582652467, 500);
    let newCentre = Matter.Vector.create(0, -35);
    Matter.Body.setCentre(this.bat1.body, newCentre, true);

    this.bat2 = this.matter.add.image(600, 840, 'bat');
    this.bat2.setScale(1 / 17);
    this.bat2.setTrapezoid(15, 110, 0.9, { chamfer: { radius: 3 } });
    this.bat2.setFrictionAir(0.1);
    this.bat2.setBounce(1);
    this.bat2.setMass(1);
    this.bat2.setInteractive();

    this.bat2.setDisplayOrigin(126.64296582652467, 500);
    Matter.Body.setCentre(this.bat2.body, newCentre, true);

    this.ball = this.matter.add.image(600, 450, 'ball');
    this.ball.setScale(1 / 15);
    this.ball.setCircle(17);
    this.ball.setBounce(0.8);
    this.ball.setVelocity(100, 30);
    this.ball.setFrictionAir(0);
    this.ball.setMass(0.001);

    console.log(bg1);
    console.log(this.bat2);
    console.log(this.ball);

    const canvas = this.sys.game.canvas;

    canvas.addEventListener('contextmenu', function (event) {
        event.preventDefault();
    });

    this.matter.world.setBounds(0, 0, 1200, 900, 1000, true, true, true, true);

    if (playerId % 2 == 0) {
        let mainCamera = this.cameras.main;
        mainCamera.setRotation(Phaser.Math.DegToRad(180));
    }
};


gameScene.update = function () {

    const maxvelocity = 40;
    let currrentvelocity = this.ball.getVelocity();
    let velocityx = currrentvelocity.x;
    let velocityy = currrentvelocity.y;
    if(velocityx>maxvelocity)
    {
        this.ball.setVelocity(40, velocityy);
        if(velocityy>maxvelocity)
            {
                this.ball.setVekocity(40,40);
            }   
    }

    else
    {
        if(velocityy>maxvelocity)
        {
        this.ball.setVelocity(velocityx, 40);
        }
    }
     
        
    
    if (playerId % 2 == 1) {

        socket.on('ball1', (bat1data) => {
            this.bat1.setPosition(bat1data.x, bat1data.y);
            //this.bat1.setVelocity(bat1data.velocity.x, bat1data.velocity.y);
            this.bat1.setAngle(bat1data.angle);
            this.bat1.setAngularVelocity(bat1data.angularVelocity);
            this.ball.setPosition(bat1data.ballx, bat1data.bally);
            //this.ball.setVelocity(bat1data.ballvelocity.x, bat1data.ballvelocity.y);
        });

        this.input.on('pointermove', function (pointer) {
            var velocityX = (pointer.x - this.bat2.x) * (0.1);
            var velocityY = (pointer.y - this.bat2.y) * (0.1);
            this.bat2.setVelocity(velocityX, velocityY);
        }, this);

        this.input.on('pointerdown', function (pointer) {
            if (pointer.leftButtonDown()) {
                this.bat2.setAngularVelocity(0.8);
            }
            if (pointer.rightButtonDown()) {
                this.bat2.setAngularVelocity(-0.8);
            }
        }, this);

        let bat2data = {x: this.bat2.x, y: this.bat2.y,
            angle: (this.bat2.rotation)*(180/Math.PI),
            angularVelocity: this.bat2.getAngularVelocity(),
            ballx: this.ball.x, bally: this.ball.y,
        }

        socket.emit('update ball2', (bat2data));

        
        
    } 
    if(playerId%2 === 0)
    {
        socket.on('ball2', (bat2data) => {
            this.bat2.setPosition(bat2data.x, bat2data.y);
            this.bat1.setAngle(bat1data.angle);
            this.bat2.setAngularVelocity(bat2data.angularVelocity);
            this.ball.setPosition(bat2data.ballx, bat2data.bally);
        });

        this.input.on('pointermove', function (pointer) {
            var velocityX = (1200 - pointer.x - this.bat1.x) * (0.1);
            var velocityY = (900 - pointer.y - this.bat1.y) * (0.1);
            this.bat1.setVelocity(velocityX, velocityY);
        }, this);

        this.input.on('pointerdown', function (pointer) {
            if (pointer.leftButtonDown()) {
                this.bat1.setAngularVelocity(0.8);
            }
            if (pointer.rightButtonDown()) {
                this.bat1.setAngularVelocity(-0.8);
            }
        },this);
        let bat1data = {x: this.bat1.x, y: this.bat1.y,
            angularVelocity:this.bat1.getAngularVelocity(),
            angle: (this.bat1.rotation)*(180/Math.PI),
            ballx: this.ball.x, bally: this.ball.y,
        }
        socket.emit('update ball1', (bat1data));

       
   }

   
   
};


let config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 900,
    physics: {
        default: 'matter',
        matter: {
            gravity: { x: 0, y: 0 },
            fps: 60,
            wireframes: false
        }
    },
    scene: gameScene,
    visibilityChange: false 
};

let game = new Phaser.Game(config);
