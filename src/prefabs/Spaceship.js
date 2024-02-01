// Spaceship prefab
class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);   // add to existing
        this.points = pointValue;   // store pointValue
        this.moveSpeed = game.settings.spaceshipSpeed;  // spaceship speed in pixels/frame
        this.direction = Phaser.Math.Between(0, 1);     // 0 = ship enters from left, 1 = enters from right
        if(this.direction == 0) {
            //this.setScale(-1, 1);
            this.flipX = -1;
        }

        // adds spaceship sprites to physics engine
        scene.physics.add.existing(this);

        // speed increase after 30 sec
        this.speedUp = scene.time.delayedCall(30000, () => {
            this.moveSpeed += 1;
        }, null, this);
    }

    update() {
        // moves spaceship depending on their direction which is determined in constructor
        if(this.direction == 0) {
            // moves spaceship to the right
            this.x += this.moveSpeed;
            // wraps around from right edge to left edge
            if(this.x >= game.config.width + this.width) {
                this.reset();
            }
        } else {
            // moves spaceship to the left
            this.x -= this.moveSpeed;
            // wraps around from left edge to right edge
            if(this.x <= 0 - this.width) {
                this.reset();
            }
        }
    }

    // reset position
    reset() {
        // resets spaceship depending on their direction which is determined in constructor
        if(this.direction == 0) {
            this.x = 0;
        } else {
            this.x = game.config.width;
        }
    }
}