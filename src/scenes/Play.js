class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    init() {
        // empty
    }

    preload() {
        // empty
    }

    create() {
        // place tile sprite
        this.background = this.add.tileSprite(0, 0, 640, 480, 'background').setOrigin(0, 0);
        this.foreground = this.add.tileSprite(0, 0, 640, 480, 'foreground').setOrigin(0, 0);

        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0)
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0)
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0)
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0)
        
        // add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);
        
        // add spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4 + 150, 'spaceship', 0, 10).setOrigin(0.5, 0.5);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceship', 0, 30).setOrigin(0.5, 0.5);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'spaceship', 0, 20).setOrigin(0.5, 0.5);

        // add small spaceship
        this.ship04 = new SmallSpaceship(this, game.config.width, borderUISize*4, 'smallspaceship', 0, 50).setOrigin(0.5, 0.5);

        // define keys
        keyFIRE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyRESET = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    
        // initialize score
        this.p1Score = 0;
        
        // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px', 
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);

        // GAME OVER flag
        this.gameOver = false;

        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);

        // handles all collision between rocket and ship
        this.physics.add.collider(this.p1Rocket, this.ship01, this.handleCollision, null, this);
        this.physics.add.collider(this.p1Rocket, this.ship02, this.handleCollision, null, this);
        this.physics.add.collider(this.p1Rocket, this.ship03, this.handleCollision, null, this);
        this.physics.add.collider(this.p1Rocket, this.ship04, this.handleCollision, null, this);
    }

    update() {
        // check key input for restart
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyRESET)) {
            this.scene.restart();
        }
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        // mouse controls 
        this.input.on('pointermove', (pointer) => {
            this.p1Rocket.x = pointer.x;
        });

        // parallaxes tile sprites
        this.background.tilePositionX -= 0.5;
        this.foreground.tilePositionX -= 1;  

        if(!this.gameOver) {
            this.p1Rocket.update();     // update rocket sprite

            this.ship01.update();       // update spaceships (x3)
            this.ship02.update();
            this.ship03.update();
            this.ship04.update();       // update small spaceship
        }

        /*// check collisions (deprecated)
        if(this.checkCollision(this.p1Rocket, this.ship01)) {
            console.log('kaboom ship01');
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }
        if(this.checkCollision(this.p1Rocket, this.ship02)) {
            console.log('kaboom ship02');
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            console.log('kaboom ship03');
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }*/
    }

    handleCollision(rocket, ship) {
        rocket.reset();
        this.shipExplode(ship);
    }

    /* (deprecated)
    checkCollision(rocket, ship) {
        // simple AABB checking
        if(rocket.x < ship.x + ship.width &&
            rocket.x + rocket.width > ship.x &&
            rocket.y < ship.y + ship.height && 
            rocket.height + rocket.y > ship.y) {
                return true;
            } else {
                return false;
            }
    }*/

    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0;

        // makes explosion at ship's position
        if(ship.direction == 1) {
            let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0.5, 0.5);
            boom.anims.play('explode');             // play explode animation
            boom.on('animationcomplete', () => {    // callback after anim completes
                ship.reset();                       // reset ship position
                ship.alpha = 1;                     // make ship visible again
                boom.destroy();                     // remove explosion sprite
            });
        } else {
            let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0.5, 0.5);
            boom.anims.play('explode');             // play explode animation
            boom.on('animationcomplete', () => {    // callback after anim completes
                ship.reset();                       // reset ship position
                ship.alpha = 1;                     // make ship visible again
                boom.destroy();                     // remove explosion sprite
            });
        }

        // score add and text update
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;

        // plays explosion sfx
        this.sound.play('sfx-explosion', {volume: 0.25});
    }

    addTime(ship) {
        // returns time to be added to timer depending on which ship was kabloomed
        this.timeInMS = ship.points * 100;
        return this.timeInMS;
    }
}