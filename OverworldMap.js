class OverworldMap{
    constructor(config){

        this.lowerImage = new Image();
        this.lowerImage.src = config.lowerSrc;
        
        this.upperImage = new Image();
        this.upperImage.src = config.lowerSrc;
    }

    drawLowerImage(ctx, cameraPerson){
        ctx.drawImage(
            this.lowerImage, utils.withGrid(10.5) - cameraPerson.x,
            this.lowerImage, utils.withGrid(6) - cameraPerson.y
        )
    }
    
    drawUpperImage(ctx, cameraPerson){
        ctx.drawImage(
            this.upperImage, utils.withGrid(10.5) - cameraPerson.x,
            this.upperImage, utils.withGrid(6) - cameraPerson.y)
    }
}

window.OverworldMap = {
    DemoMap: {      //demoroom
        lowerSrc: "/images/maps/s_demomap.png",
        upperSrc: "/images/maps/s_demomap.png",
        gameObjects: {
            hero: new Characters({
            isPlayerControlled: true,
            x: utils.withGrid(5),
            y: utils.withGrid(6),
            })
        }
    },
    Pathway: {      //kitchen
        lowerSrc: "/images/maps/s_pathmap.png",
        upperSrc: "/images/maps/s_pathmap.png",
        gameObjects: {
            hero: new Characters({
            x: utils.withGrid(5),
            y: utils.withGrid(6),
            })
        }
    },
}