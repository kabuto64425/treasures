import { SceneContext } from "./sceneContext";

export class TestScene extends Phaser.Scene {
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
    }
}