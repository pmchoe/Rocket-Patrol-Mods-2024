// Rocket prefab
class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        // add object to existing scene
        scene.add.existing(this);   // add to existing, displayList, updateList
        this.isFiring = false;      // track rocket's firing status
        this.moveSpeed = 2;         // rocket speed in pixels/frame

        this.sfxShot = scene.sound.add('sfx-shot');

        // adds rocket sprite to physics engine
        scene.physics.add.existing(this);
    }

    update() {
        // left/right movement
        if(!this.isFiring) {
            if(keyLEFT.isDown && this.x >= borderUISize + this.width) {
                this.x -= this.moveSpeed;
            } else if(keyRIGHT.isDown && this.x <= game.config.width - borderUISize - this.width) {
                this.x += this.moveSpeed;
            }
        }

        // fire button/click
        if((Phaser.Input.Keyboard.JustDown(keyFIRE) || this.scene.input.activePointer.leftButtonDown()) && !this.isFiring) {
            this.isFiring = true;
            this.sfxShot.play({volume: 0.2});
        }
        // if fired, move ship up
        if(this.isFiring && this.y >= borderUISize * 3 + borderPadding) {
            this.y -= this.moveSpeed;
        }
        // reset ship on miss
        if(this.y <= borderUISize * 3 + borderPadding) {
            this.isFiring = false;
            this.y = game.config.height - borderUISize - borderPadding;
        } 
    }

    // reset rocket to default position
    reset() {
        this.isFiring = false;
        this.y = game.config.height - borderUISize - borderPadding;
    }
}