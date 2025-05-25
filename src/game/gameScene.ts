import Phaser from "phaser";
import { GameSceneGeneralSupervision } from "./gameSceneGeneralSupervision";
import { BestRecord } from "./bestRecord";
import { DebugView } from "./debugView";
import { DebugData } from "./debugData";

export class GameScene extends Phaser.Scene {

    private readonly params: any;
    private readonly bestRecoed: BestRecord;

    // create内で、必ず初期化しておくこと
    private gameSceneGeneralSupervision!: GameSceneGeneralSupervision;

    private debugData: DebugData;

    constructor(params: any, bestRecord: BestRecord) {
        super("gameScene");
        this.params = params;
        this.bestRecoed = bestRecord;
        this.debugData = new DebugData();
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
        const view = new DebugView(this.debugData);
        Phaser.GameObjects.BitmapText.ParseFromAtlas(this, "font", "fontatlas", "azo-fire", "azoXML");

        this.gameSceneGeneralSupervision = new GameSceneGeneralSupervision(this);
        this.gameSceneGeneralSupervision.setupSupervision();
        view.setup();
    }

    // @ts-ignore: デバッグ用
    private busyWait(ms: number) {
        const start = performance.now();
        while (performance.now() - start < ms) { }
    }

    update(_time: number, _delta: number) {
        let now = performance.now();
        const gameSceneGeneralSupervision = this.gameSceneGeneralSupervision;
        gameSceneGeneralSupervision.updatePerFrame();
        this.debugData.frameDelta = _delta;
        this.debugData.updateDuration = performance.now() - now;
    }

    getParams() {
        return this.params;
    }

    getBestRecord() {
        return this.bestRecoed;
    }
}