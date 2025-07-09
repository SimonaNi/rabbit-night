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

        //carrot objects (random positions)
        this.carrotImage = new Image();
        this.carrotImage.src = "./images/s_carrot.png";
        this.carrots = [];
        this.initCarrots();

        //carrot counters
        this.goodCarrotsCollected = 0;
        this.poisonCarrotsCollected = 0;

        //win/lose callbacks
        this.onWin = null;
        this.onLose = null;
    }

    initCarrots() {
        //5 healthy, 3 poison
        const total = 8;
        const healthy = 5;
        const poison = 3;
        const positions = new Set();

        // Get map pixel size (default fallback if not loaded)
        const mapWidthPx = this.lowerImage.naturalWidth || 402;
        const mapHeightPx = this.lowerImage.naturalHeight || 248;

        // Carrot size and grid
        const carrotSize = 16;
        // Compute grid bounds, skipping 50px from each edge
        const minX = Math.ceil((50) / carrotSize);
        const maxX = Math.floor((mapWidthPx - 50) / carrotSize) - 1;
        const minY = Math.ceil((50) / carrotSize);
        const maxY = Math.floor((mapHeightPx - 50) / carrotSize) - 1;

        // Random unique positions within safe area
        while (positions.size < total) {
            const x = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
            const y = Math.floor(Math.random() * (maxY - minY + 1)) + minY;
            positions.add(`${x},${y}`);
        }
        const posArr = Array.from(positions).map(str => {
            const [x, y] = str.split(',').map(Number);
            return { x, y };
        });
        for (let i = 0; i < healthy; i++) {
            this.carrots.push({ ...posArr[i], type: "good" });
        }
        for (let i = healthy; i < total; i++) {
            this.carrots.push({ ...posArr[i], type: "poison" });
        }
    }

    checkCarrotPickup(playerX, playerY) {
        //carrots are on a 16x16 grid
        for (let i = 0; i < this.carrots.length; i++) {
            const carrot = this.carrots[i];
            if (carrot.x * 16 === playerX && carrot.y * 16 === playerY) {
                if (carrot.type === "good") {
                    this.goodCarrotsCollected++;
                    this.carrots.splice(i, 1);
                    //win condition
                    if (this.goodCarrotsCollected === 5 && typeof this.onWin === "function") {
                        this.onWin();
                    }
                    return;
                } else {
                    this.poisonCarrotsCollected++;
                    this.carrots.splice(i, 1);
                    //lose condition
                    if (this.poisonCarrotsCollected === 3 && typeof this.onLose === "function") {
                        this.onLose();
                    }
                    return;
                }
            }
        }
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

        //draw carrots on top of the map
        if (this.carrotImage.complete && this.carrotImage.naturalWidth > 0) {
            for (const carrot of this.carrots) {
                const x = carrot.x * 16 + utils.withGrid(10.5) - cameraPerson.x;
                const y = carrot.y * 16 + utils.withGrid(6) - cameraPerson.y;
                ctx.drawImage(this.carrotImage, x, y, 16, 16);
                //draw a colored border to distinguish poison but ill figure out a better way to do this later
                if (carrot.type === "poison") {
                    ctx.strokeStyle = "red";
                    ctx.lineWidth = 2;
                    ctx.strokeRect(x, y, 16, 16);
                } else {
                    ctx.strokeStyle = "lime";
                    ctx.lineWidth = 2;
                    ctx.strokeRect(x, y, 16, 16);
                }
            }
        }

        //draw carrot counters
        ctx.save();
        ctx.font = "12px sans-serif";
        ctx.fillStyle = "white";
        ctx.fillText(`Good carrots: ${this.goodCarrotsCollected}`, 10, 20);
        ctx.fillText(`Poison carrots: ${this.poisonCarrotsCollected}`, 10, 40);
        ctx.restore();
    }
}

window.OverworldMap = {
    DemoMap: {      //demoroom iykwim
        lowerSrc: "./images/maps/s_demomap.png",
        upperSrc: "./images/maps/s_demomap.png",
        gameObjects: {
            hero: new Characters({
            isPlayerControlled: true,
            x: utils.withGrid(5),
            y: utils.withGrid(6),
            })
        }
    },
    Pathway: {      //k
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