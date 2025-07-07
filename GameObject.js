class GameObject{
    constructor(config){
        this.x = config.x || 0; //making the char position 0 by defult
        this.y = config.y || 0;
        this.direction = config.direction || "down";
        this.sprite = new Sprite({
           gmaeOnject: this, 
           src: config.src || "/images/rabbit.png",
        });
    }

    update() {

    }
}