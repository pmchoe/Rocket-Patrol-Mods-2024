// small spaceship prefab
class SmallSpaceship extends Spaceship {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame);
    
        this.points = pointValue;
        this.moveSpeed = game.settings.spaceshipSpeed + 3;
    }
}