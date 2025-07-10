//for moving objects
class Characters extends GameObject{
    constructor(config) {
        super(config);
        this.movingProgressRemaining = 0;

        this.isPlayerControlled = config.isPlayerControlled || false; //setting a f defult

        this.directionUpdate = {
            "up": ["y", -1],
            "down": ["y", 1],
            "left": ["x", -1],
            "right": ["x", 1],
        };
    }

    update(state) {
        this.updatePosition();
        this.updateSprite(state);

        //check for carrot pickup after movement
        if (this.isPlayerControlled && typeof state.map !== "undefined") {
            state.map.checkCarrotPickup(this.x, this.y);
        }

        //limit movement within map 
        if (this.isPlayerControlled && this.movingProgressRemaining === 0 && state.arrow){
            //map bounds logic
            const map = state.map;
            const gridSize = 16;
            //using lowerImage size if loaded, else fallback to default
            const mapWidthPx = map.lowerImage.naturalWidth || 402;
            const mapHeightPx = map.lowerImage.naturalHeight || 248;
            const minX = 0;
            const minY = 0;
            const maxX = mapWidthPx - gridSize;
            const maxY = mapHeightPx - gridSize;

            let nextX = this.x;
            let nextY = this.y;
            if (state.arrow === "up") nextY -= gridSize;
            if (state.arrow === "down") nextY += gridSize;
            if (state.arrow === "left") nextX -= gridSize;
            if (state.arrow === "right") nextX += gridSize;

            //clamp nextX and nextY to map bounds
            if (
                nextX >= minX &&
                nextX <= maxX &&
                nextY >= minY &&
                nextY <= maxY
            ) {
                this.direction = state.arrow;
                this.movingProgressRemaining = gridSize;
            }
            //else: do not move if out of bounds
        }
    }

    updatePosition(){
        if(this.movingProgressRemaining > 0) {
            const [property, change] = this.directionUpdate[this.direction];
            this[property] += change;
            this.movingProgressRemaining -= 1;
        }
    }

    updateSprite(state){

        if (this.isPlayerControlled && this.movingProgressRemaining === 0 && !state.arrow){
            this.sprite.setAnimation("idle-"+this.direction);
            return;
        }

        if (this.movingProgressRemaining > 0){
                this.sprite.setAnimation("walk-" + this.direction);
        }
    }
}