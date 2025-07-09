class OverworldMap{
    constructor(config){

        this.lowerImage = new Image();
        this.lowerImage.src = config.lowerSrc;
        this.lowerImageLoaded = false;
        this.lowerImage.onload = () => {
            this.lowerImageLoaded = true;
        };

        this.upperImage = new Image();
        this.upperImage.src = config.upperSrc;
        this.upperImageLoaded = false;
        this.upperImage.onload = () => {
            this.upperImageLoaded = true;
        };

        this.gameObjects = config.gameObjects || {};
    }

    drawLowerImage(ctx, cameraPerson){
        if (this.lowerImageLoaded) {
            ctx.drawImage(
                this.lowerImage, 
                utils.withGrid(10.5) - cameraPerson.x,
                utils.withGrid(6) - cameraPerson.y
            );
        }
    }
    
    drawUpperImage(ctx, cameraPerson){
        if (this.upperImageLoaded) {
            ctx.drawImage(
                this.upperImage, 
                utils.withGrid(10.5) - cameraPerson.x,
                utils.withGrid(6) - cameraPerson.y
            );
        }
    }
}

window.OverworldMap = {
    DemoMap: {      //demoroom
        lowerSrc: "./images/maps/demomap.png",
        upperSrc: "./images/maps/demomap.png",
        gameObjects: {
            hero: new Characters({
            isPlayerControlled: true,
            x: utils.withGrid(5),
            y: utils.withGrid(6),
            })
        }
    },
    Pathway: {      //kitchen
        lowerSrc: "./images/maps/pathmap.png",
        upperSrc: "./images/maps/pathmap.png",
        gameObjects: {
            hero: new Characters({
            x: utils.withGrid(5),
            y: utils.withGrid(6),
            })
        }
    },
}