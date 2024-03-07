import Phaser from "phaser";

export type Collidable =
    | Phaser.Types.Physics.Arcade.GameObjectWithBody
    | Phaser.Tilemaps.Tile;

export default class Scene1 extends Phaser.Scene {
    private platforms?: Phaser.Physics.Arcade.StaticGroup;
    private player?: Phaser.Physics.Arcade.Sprite;
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    private portals?: Phaser.Physics.Arcade.StaticGroup;

    private score = 0;
    private scoreText?: Phaser.GameObjects.Text;

    constructor() {
        super({ key: "Scene1" });
    }

    init(data: { score: number }) {
        this.score = data.score;
    }

    create() {
        const message = `Phaser v${Phaser.VERSION}`;

        this.add
            .text(this.cameras.main.width - 15, 15, message, {
                color: "#000000",
                fontSize: "24px",
            })
            .setOrigin(1, 0);

        this.add.image(400, 300, "sky1");

        this.platforms = this.physics.add.staticGroup();
        const ground = this.platforms.create(
            400,
            568,
            "ground"
        ) as Phaser.Physics.Arcade.Sprite;

        ground.setScale(2).refreshBody();

        this.platforms.create(600, 400, "ground");
        this.platforms.create(50, 250, "ground");
        this.platforms.create(750, 220, "ground");

        this.player = this.physics.add.sprite(750, 330, "dude");
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        this.anims.create({
            key: "left",
            frames: this.anims.generateFrameNumbers("dude", {
                start: 0,
                end: 3,
            }),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: "turn",
            frames: [{ key: "dude", frame: 4 }],
            frameRate: 20,
        });

        this.anims.create({
            key: "right",
            frames: this.anims.generateFrameNumbers("dude", {
                start: 5,
                end: 8,
            }),
            frameRate: 10,
            repeat: -1,
        });

        this.physics.add.collider(this.player, this.platforms);

        this.cursors = this.input.keyboard?.createCursorKeys();

        this.portals = this.physics.add.staticGroup();

        const portal2 = this.portals.create(
            50,
            200,
            "p2"
        ) as Phaser.Physics.Arcade.Sprite;

        const portal3 = this.portals.create(
            750,
            170,
            "p3"
        ) as Phaser.Physics.Arcade.Sprite;

        const portal4 = this.portals.create(
            400,
            500,
            "p4"
        ) as Phaser.Physics.Arcade.Sprite;

        portal2.setData("scene", "Scene2");
        portal3.setData("scene", "Scene3");
        portal4.setData("scene", "MainScene");

        this.physics.add.collider(this.portals, this.platforms);
        this.physics.add.overlap(
            this.player,
            this.portals,
            this.handleEnterPortal,
            undefined,
            this
        );

        this.scoreText = this.add.text(16, 16, `Score: ${this.score}`, {
            fontSize: "32px",
            color: "#000",
        });
    }

    private handleEnterPortal(player: Collidable, portal: Collidable) {
        const p = portal as Phaser.Physics.Arcade.Image;
        p.disableBody(true, true);

        this.score += 1;
        this.scoreText?.setText(`Score: ${this.score}`);

        this.scene.start(p.getData("scene"), { score: this.score });
    }

    update() {
        if (!this.cursors) {
            return;
        }
        if (this.cursors.left.isDown) {
            this.player?.setVelocityX(-160);
            this.player?.anims.play("left", true);
        } else if (this.cursors.right.isDown) {
            this.player?.setVelocityX(160);
            this.player?.anims.play("right", true);
        } else {
            this.player?.setVelocityX(0);
            this.player?.anims.play("turn");
        }
        if (this.cursors.up.isDown && this.player?.body?.touching.down) {
            this.player.setVelocity(-330);
        }
    }
}
