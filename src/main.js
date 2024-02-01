/*
Philip Choe
Rocket Patrol Redux
approx time: 7.5 hours

Mods:
    - Two 5-point tier mods (10 total)
        - Create a new enemy Spaceship type (w/ new artwork) that's smaller, moves faster, and is worth more points (5)
        - Implement mouse control for player movement and left mouse click to fire (5)
    - Two 3-point tier mods (6 total)
        - Implement parallax scrolling for the background (3)
        - Display the time remaining (in seconds) on the screen (3)
    - Three 1-point tier mods (4 total)
        - Create a new scrolling tile sprite for the background (1)
        - Allow the player to control the Rocket after it's fired (1)
        - Randomize each spaceship's movement direction at the start of each play (1)
        - Implement the speed increase that happens after 30 seconds in the original game (1)
*/

let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [ Menu, Play ],
    physics: {
        default: 'arcade',
        arcade: {
            debug: true // useful, shows physics objects with pink outline
        }
    }
};

let game = new Phaser.Game(config);

// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

// reserve keyboard bindings
let keyFIRE, keyRESET, keyLEFT, keyRIGHT;

