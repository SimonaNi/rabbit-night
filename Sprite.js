class Sprite{
    constructor(config){
        this.image = new Image();
        this.image.src = config.src;
        this.image.onload = () => {
            this.isLoaded = true;
        };
        
        this.animation = config.animation || {

            "idle-down": [ [0,0] ],
            "idle-right": [ [0,1] ],
            "idle-up": [ [0,2] ],
            "idle-left": [ [0,3] ],
            "walk-down": [ [1,0], [0,0], [3,0], [0,0] ], 
            "walk-right": [ [1,1], [0,1], [3,1], [0,1] ],
            "walk-up": [ [1,2], [0,2], [3,2], [0,2] ],
            "walk-left": [ [1,3], [0,3], [3,3], [0,3] ]
        }
        this.currentAnimation = config.currentAnimation || "idle-down";
        this.currentAnimationFrame = 0;

        this.animationFrameLimit = config.animationFrameLimit || 8;
        this.animationFrameProgress = this.animationFrameLimit;

        this.gameObject = config.gameObject;
    }

    get frame () {
        return this.animation[this.currentAnimation][this.currentAnimationFrame];
    }

    setAnimation(key){
        if (this.currentAnimation !== key){
            this.currentAnimation = key;
            this.currentAnimationFrame = 0;
            this.animationFrameProgress = this.animationFrameLimit; 
        }
    }

    updateAnimationProgress() {
        //downtick frame progress
        if (this.animationFrameProgress > 0 ){
            this.animationFrameProgress -= 1;
            return;
        }
        //reset counter 
        this.animationFrameProgress = this.animationFrameLimit;
        this.currentAnimationFrame += 1;

        if (this.frame === undefined) {
            this.currentAnimationFrame = 0;
        }
    }

    draw(ctx, cameraPerson) {
        if (ctx instanceof WebGLRenderingContext) {
            this.drawWebGL(ctx, cameraPerson);
            this.updateAnimationProgress();
            return;
        }

        const x = this.gameObject.x - 8 + utils.withGrid(10.5) - cameraPerson.x;
        const y = this.gameObject.y - 18 + utils.withGrid(6) - cameraPerson.y;

        if (this.isShadowLoaded) ctx.drawImage (this.shadow, x, y);


        const [frameX, frameY] = this.frame;

        if (this.isLoaded) {
            ctx.drawImage(
                this.image,
                frameX * 48, frameY * 48,
                48, 48,
                x, y,
                48, 48
            );
        }
        
        this.updateAnimationProgress();
    }

    drawWebGL(gl, cameraPerson) {
        // Calculate sprite position
        const x = this.gameObject.x - 8 + utils.withGrid(10.5) - cameraPerson.x;
        const y = this.gameObject.y - 18 + utils.withGrid(6) - cameraPerson.y;
        const [frameX, frameY] = this.frame;

        // Use a global WebGLRenderer utility to draw the sprite
        if (this.isLoaded) {
            WebGLRenderer.drawSprite({
                gl,
                image: this.image,
                sx: frameX * 48,
                sy: frameY * 48,
                sw: 48,
                sh: 48,
                dx: x,
                dy: y,
                dw: 48,
                dh: 48,
            });
        }
    }
}