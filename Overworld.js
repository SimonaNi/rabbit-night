class Overworld{
    constructor(config){
        this.element = config.element;
        this.canvas = this.element.querySelector(".game-canvas");
        this.ctx = this.canvas.getContext("2d");
        this.map = null;
    }

    startGameLoop(){
        const step =() => {

            //clear off the canvas
            this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);

            //camera
            const cameraPerson = this.gameObjects.hero;

            //update objects
            Object.values(this.map.gameObjects).forEach(Object => {
                Object.update ({
                    arrow: this.directionInput.direction
                });
            })

            this.map.drawLowerImage(this.ctx, cameraPerson);

            // draw upper map before game objects
            this.map.drawUpperImage(this.ctx, cameraPerson);

            //draw game objects (characters) on top of upper map
            Object.values(this.map.gameObjects).forEach(Object => {
                Object.sprite.draw(this.ctx, cameraPerson);
            } )

            requestAnimationFrame(() =>{
                step();
            })
        }
        step ();
    }

    waitForMapImagesLoaded(callback) {
        //wait until both lower and upper images are loaded
        const check = () => {
            if (this.map.lowerImageLoaded && this.map.upperImageLoaded) {
                callback();
            } else {
                setTimeout(check, 50);
            }
        };
        check();
    }

    init(){
        this.map = new OverworldMap(window.OverworldMap.DemoMap); 

        this.gameObjects = this.map.gameObjects;

        this.directionInput = new DirectionInput();
        this.directionInput.init();

        this.waitForMapImagesLoaded(() => {
            this.startGameLoop();
        });
    }
}