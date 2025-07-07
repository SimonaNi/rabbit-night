class Overworld{
    constructor(config){
        this.element = config.element;
        this.canvas = this.element.querySelector(".game-canvas");
        this.ctx = this.canvas.getContext("2d");
        this.map = null;
    }

    startGameLoop(){
        const step =() => {

            //clrar off the canvas
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

            //draw game objects
            Object.values(this.map.gameObjects).forEach(Object => {
                Object.sprite.draw(this.ctx, cameraPerson);
            } )      

            this.map.drawUpperImage(this.ctx, cameraPerson);

            requestAnimationFrame(() =>{
                step();
            })
        }
        step ();
    }

    init(){
        this.map = new OverworldMap(window.OverworldMap.DemoMap); 

        this.directionInput = new DirectionInput();
        this.directionInput.init();

        this.startGameLoop();

    }
}