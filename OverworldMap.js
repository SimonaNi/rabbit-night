class OverworldMap{
    constructor(config){

        this.lowerImage = new Image();
        this.lowerImage.src = config.lowerSrc;
        this.lowerImageLoaded = false;
        this.lowerImage.onload = () => {
            this.lowerImageLoaded = true;
            this.initCarrots(); // <-- only initialize carrots after image is loaded!!!
        };

        this.upperImage = new Image();
        this.upperImage.src = config.upperSrc;
        this.upperImageLoaded = false;
        this.upperImage.onload = () => {
            this.upperImageLoaded = true;
        };

        this.gameObjects = config.gameObjects || {};

        // images for carrots and teeth
        this.goodCarrotImage = new Image();
        this.goodCarrotImage.src = "./images/carrot2.png";
        this.toothImage = new Image();
        this.toothImage.src = "./images/tooth.png";

        this.carrots = [];

        //carrot counters
        this.goodCarrotsCollected = 0;
        this.lives = 3;     //starting with 3 hearts

        //win/lose callbacks
        this.onWin = null;
        this.onLose = null;

        //tooth message flag
        this.toothMessageShown = false;
    }

    initCarrots() {
        // 5 healthy, 4 poison
        const total = 9;
        const healthy = 5;
        const poison = total - healthy;
        const positions = [];
        const minDistancePx = 100; // minimum pixel distance between items

        //get map pixel size (default fallback if not loaded)
        const mapWidthPx = this.lowerImage.naturalWidth || 402;
        const mapHeightPx = this.lowerImage.naturalHeight || 248;

        const carrotSize = 16;
        const minX = Math.ceil((100) / carrotSize);
        const maxX = Math.floor((mapWidthPx - 100) / carrotSize) - 1;
        const minY = Math.ceil((100) / carrotSize);
        const maxY = Math.floor((mapHeightPx - 100) / carrotSize) - 1;

        function isFarEnoughPx(x, y, arr, minDistPx) {
            for (const pos of arr) {
                const dx = (pos.x - x) * carrotSize;
                const dy = (pos.y - y) * carrotSize;
                if (Math.sqrt(dx*dx + dy*dy) < minDistPx) return false;
            }
            return true;
        }

        let attempts = 0;
        while (positions.length < total && attempts < 1000) {
            const x = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
            const y = Math.floor(Math.random() * (maxY - minY + 1)) + minY;
            if (isFarEnoughPx(x, y, positions, minDistancePx)) {
                positions.push({ x, y });
            }
            attempts++;
        }
        //if not enough razdelicheni positions found, fill the rest randomly
        while (positions.length < total) {
            const x = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
            const y = Math.floor(Math.random() * (maxY - minY + 1)) + minY;
            positions.push({ x, y });
        }

        this.carrots = [];
        for (let i = 0; i < healthy; i++) {
            this.carrots.push({ ...positions[i], type: "good" });
        }
        for (let i = healthy; i < total; i++) {
            this.carrots.push({ ...positions[i], type: "poison" });
        }
    }

    checkCarrotPickup(playerX, playerY) {
        //carrots are on a 16x16 grid + 2px margin
        for (let i = 0; i < this.carrots.length; i++) {
            const carrot = this.carrots[i];
            const carrotPx = carrot.x * 16;
            const carrotPy = carrot.y * 16;
            // hitbox + 2px on each side
            if (
                playerX >= carrotPx - 2 &&
                playerX <= carrotPx + 16 + 2 - 1 &&
                playerY >= carrotPy - 2 &&
                playerY <= carrotPy + 16 + 2 - 1
            ) {
                if (carrot.type === "good") {
                    this.goodCarrotsCollected++;
                    this.carrots.splice(i, 1);
                    //win condition
                    if (this.goodCarrotsCollected === 5 && typeof this.onWin === "function") {
                        this.onWin();
                    }
                    return;
                } else {
                    this.lives--;
                    this.carrots.splice(i, 1);
                    //show tooth message only the first time
                    if (!this.toothMessageShown) {
                        this.showToothMessage();
                        this.toothMessageShown = true;
                    }
                    //lose condition
                    if (this.lives === 0 && typeof this.onLose === "function") {
                        this.onLose();
                    }
                    return;
                }
            }
        }
    }

    showToothMessage() {
        let msg = document.getElementById("tooth-msg");
        if (!msg) {
            msg = document.createElement("div");
            msg.id = "tooth-msg";
            msg.style.position = "fixed";
            msg.style.top = "30%";
            msg.style.left = "50%";
            msg.style.transform = "translate(-50%, -50%)";
            msg.style.background = "rgba(0,0,0,0.85)";
            msg.style.color = "white";
            msg.style.fontSize = "1.5em";
            msg.style.padding = "1em 2em";
            msg.style.borderRadius = "1em";
            msg.style.zIndex = "9999";
            msg.style.textAlign = "center";
            msg.textContent = "You found a tooth... better be more careful...";
            document.body.appendChild(msg);
            setTimeout(() => {
                if (msg.parentNode) msg.parentNode.removeChild(msg);
            }, 3500);
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

        //draw carrots (good) and teeth (poison) on top of the map
        for (const carrot of this.carrots) {
            const x = carrot.x * 16 + utils.withGrid(10.5) - cameraPerson.x;
            const y = carrot.y * 16 + utils.withGrid(6) - cameraPerson.y;
            if (carrot.type === "poison") {
                if (this.toothImage.complete && this.toothImage.naturalWidth > 0) {
                    ctx.drawImage(this.toothImage, x, y, 16, 16);
                }
            } else {
                if (this.goodCarrotImage.complete && this.goodCarrotImage.naturalWidth > 0) {
                    ctx.drawImage(this.goodCarrotImage, x, y, 16, 16);
                }
            }
        }

        //draw carrot counters and hearts
        ctx.save();
        ctx.font = "12px sans-serif";
        ctx.fillStyle = "white";
        ctx.fillText(`Carrots: ${this.goodCarrotsCollected}`, 10, 20);

        // draw hearts
        ctx.font = "20px sans-serif";
        let hearts = "";
        for (let i = 0; i < 3; i++) {
            hearts += i < this.lives ? "♡ " : "  ";
        }
        ctx.fillStyle = "red";
        ctx.fillText(hearts.trim(), 10, 45);
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