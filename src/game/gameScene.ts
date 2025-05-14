import Phaser from "phaser";
import { GameSceneGeneralSupervision } from "./gameSceneGeneralSupervision";
import { BestRecord } from "./bestRecord";

export class GameScene extends Phaser.Scene {
    private readonly params: any;
    private readonly bestRecoed: BestRecord;
    private gameSceneGeneralSupervision: GameSceneGeneralSupervision | undefined;

    private cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;

    constructor(params: any, bestRecord: BestRecord) {
        super("gameScene");
        this.params = params;
        this.bestRecoed = bestRecord;
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
        this.load.image("retry", "/treasures/retry.svg");
        this.load.image("delete", "/treasures/delete.svg");
    }

    create() {
        Phaser.GameObjects.BitmapText.ParseFromAtlas(this, "font", "fontatlas", "azo-fire", "azoXML");

        this.cursors = this.input.keyboard.createCursorKeys();
        this.gameSceneGeneralSupervision = new GameSceneGeneralSupervision(this, this.params);
        this.gameSceneGeneralSupervision.setupSupervision();
    }

    // @ts-ignore: デバッグ用
    private busyWait(ms: number) {
        const start = performance.now();
        while (performance.now() - start < ms) { }
    }

    update(_time: number, _delta: number) {
        // create内で確実に作成しているので、アサーションでもいけるはず
        const gameSceneGeneralSupervision = this.gameSceneGeneralSupervision!;
        if(gameSceneGeneralSupervision.isPlaying()) {
            gameSceneGeneralSupervision.updatePerFrame(this.cursors!);
        }
    }

    getBestRecord() {
        return this.bestRecoed;
    }
}