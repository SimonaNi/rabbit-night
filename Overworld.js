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
                    arrow: this.directionInput.direction,
                    map: this.map // pass map for carrot pickup
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

    showWinPopup() {
        let popup = document.getElementById("win-popup");
        if (!popup) {
            popup = document.createElement("div");
            popup.id = "win-popup";
            popup.style.position = "fixed";
            popup.style.top = "0";
            popup.style.left = "0";
            popup.style.width = "100vw";
            popup.style.height = "100vh";
            popup.style.background = "rgba(0,0,0,0.7)";
            popup.style.display = "flex";
            popup.style.flexDirection = "column";
            popup.style.justifyContent = "center";
            popup.style.alignItems = "center";
            popup.style.zIndex = "9999";

            const msg = document.createElement("div");
            msg.textContent = "You Win!";
            msg.style.color = "white";
            msg.style.fontSize = "2em";
            msg.style.marginBottom = "1em";

            const btn = document.createElement("button");
            btn.textContent = "Play Again?";
            btn.style.fontSize = "1.2em";
            btn.style.padding = "0.5em 1.5em";
            btn.onclick = () => window.location.reload();

            popup.appendChild(msg);
            popup.appendChild(btn);
            document.body.appendChild(popup);
        } else {
            popup.style.display = "flex";
        }
    }

    showLosePopup() {
        let popup = document.getElementById("lose-popup");
        if (!popup) {
            popup = document.createElement("div");
            popup.id = "lose-popup";
            popup.style.position = "fixed";
            popup.style.top = "0";
            popup.style.left = "0";
            popup.style.width = "100vw";
            popup.style.height = "100vh";
            popup.style.background = "rgba(0,0,0,0.7)";
            popup.style.display = "flex";
            popup.style.flexDirection = "column";
            popup.style.justifyContent = "center";
            popup.style.alignItems = "center";
            popup.style.zIndex = "9999";

            const msg = document.createElement("div");
            msg.textContent = "You Lose!";
            msg.style.color = "white";
            msg.style.fontSize = "2em";
            msg.style.marginBottom = "1em";

            const btn = document.createElement("button");
            btn.textContent = "Try Again?";
            btn.style.fontSize = "1.2em";
            btn.style.padding = "0.5em 1.5em";
            btn.onclick = () => window.location.reload();

            popup.appendChild(msg);
            popup.appendChild(btn);
            document.body.appendChild(popup);
        } else {
            popup.style.display = "flex";
        }
    }

    init(){
        this.map = new OverworldMap(window.OverworldMap.DemoMap); 

        this.gameObjects = this.map.gameObjects;

        this.directionInput = new DirectionInput();
        this.directionInput.init();

        // set win/lose callbacks
        this.map.onWin = () => this.showWinPopup();
        this.map.onLose = () => this.showLosePopup();

        this.waitForMapImagesLoaded(() => {
            this.startGameLoop();
        });
    }
}