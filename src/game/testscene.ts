import VirtualJoyStickPlugin from "phaser3-rex-plugins/plugins/virtualjoystick-plugin";
import { SceneContext } from "./sceneContext";
import VirtualJoyStick from "phaser3-rex-plugins/plugins/input/virtualjoystick/VirtualJoyStick";

export class TestScene extends Phaser.Scene {
    private joystick?: VirtualJoyStick;

    constructor() {
        super("test")
    }

    preload() {
        //https://cdn.phaserfiles.com/v385/assets/atlas/bitmap-fonts-debug.png
        //https://cdn.phaserfiles.com/v385/assets/atlas/bitmap-fonts.json
        //https://cdn.phaserfiles.com/v385/assets/fonts/bitmap/azo-fire.xml
        this.load.atlas("fontatlas", "/treasures/bitmap-fonts-debug.png", "/treasures/bitmap-fonts.json");
        this.load.xml("azoXML", "/treasures/azo-fire.xml");

        //https://cdn.phaserfiles.com/v385/assets/ui/nine-slice.png
        //https://cdn.phaserfiles.com/v385/assets/ui/nine-slice.json
        this.load.atlas('ui', 'nine-slice.png', 'nine-slice.json');

        //https://icon-rainbow.com/
        this.load.image("play", "/treasures/play.svg");
        this.load.image("pause", "/treasures/pause.svg");
        this.load.image("retry", "/treasures/retry.svg");
        this.load.image("delete", "/treasures/delete.svg");

        // https://pipoya.net/sozai/assets/icon/icon-image/
        this.load.spritesheet('emotion', '/treasures/pipo-emotion.png', {
            frameWidth: 32,  // 1アイコンの幅
            frameHeight: 32, // 1アイコンの高さ
        });
    }

    create() {
        SceneContext.setup(this);
        this.add.text(100, 100, 'Hello!コンピュータ0', {
            fontFamily: 'BestTen-CRT',
            fontSize: '32px',
            color: '#000000'
        });
        this.anims.create({
            key: 'iconAnim',
            frames: this.anims.generateFrameNumbers('emotion', { start: 204, end: 205 }),
            frameRate: 2,
            repeat: -1 // 無限ループ
        });

        const icon = this.add.sprite(200, 200, 'emotion');
        icon.play('iconAnim');

        this.joystick = (this.plugins.get('rexVirtualJoyStick') as VirtualJoyStickPlugin).add(this, {
            x: 100,
            y: 400,
            radius: 50,
            base: this.add.circle(0, 0, 50, 0x888888),
            thumb: this.add.circle(0, 0, 25, 0xcccccc),
            // 方向の制限（水平・垂直）も可能
            dir: '4dir',
        });
    }

    update() {
        var cursorKeys = this.joystick?.createCursorKeys();

        if (cursorKeys?.left.isDown) {
            console.log("left");
        }
    }
}