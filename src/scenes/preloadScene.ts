import Phaser from "phaser";

export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: "PreloadScene" });
    }

    preload() {
        this.load.image("phaser-logo", "assets/img/phaser-logo.png");
        this.load.image("sky", "assets/sky.png");
        this.load.image("sky1", "assets/sky1.png");
        this.load.image("sky2", "assets/sky2.png");
        this.load.image("sky3", "assets/sky3.png");
        this.load.image("ground", "assets/platform.png");
        this.load.spritesheet("dude", "assets/dude.png", {
            frameWidth: 32,
            frameHeight: 48,
        });
        this.load.image("p1", "assets/portal1.png");
        this.load.image("p2", "assets/portal2.png");
        this.load.image("p3", "assets/portal3.png");
        this.load.image("p4", "assets/portal.png");
    }

    create() {
        this.scene.start("MainScene", { score: 0 });
    }
}
