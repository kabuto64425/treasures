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
    }

    create() {
        SceneContext.setup(this);
        const container = SceneContext.make.container({x:109, y:513}, true);
        const image = SceneContext.make.image({ x: 0, y: 0, key: "retry" }, false);
        image.setOrigin(0, 0);
        image.setScale(0.5);
        container.add(image);

        const progressBox = SceneContext.make.graphics({ x: 0, y: -23, key: "retry" }, false);
        progressBox.setVisible(true);
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(0, 0, 70, 17);
        container.add(progressBox);
        
        const progressBar = SceneContext.make.graphics({ x: 0, y: -23, key: "retry" }, false);
        progressBar.setVisible(true);
        progressBar.fillStyle(0xffff00, 0.8);
        progressBar.fillRect(0, 0, 70, 17);
        container.add(progressBar);
    }
}