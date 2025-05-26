import Phaser from "phaser";
import { GameSceneGeneralSupervision } from "./gameSceneGeneralSupervision";
import { BestRecord } from "./bestRecord";
import { DebugView } from "./debugView";
import { DebugData, DebugDataMediator } from "./debugData";
import * as Util from "./utils";
import { Logger } from "./logger";

export class GameScene extends Phaser.Scene {

    private readonly params: any;
    private readonly bestRecoed: BestRecord;

    // create内で、必ず初期化しておくこと
    private gameSceneGeneralSupervision!: GameSceneGeneralSupervision;

    private debugData: DebugData;

    private isDebugStepMode = false;
    private doStepOnce = false;

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
        Phaser.GameObjects.BitmapText.ParseFromAtlas(this, "font", "fontatlas", "azo-fire", "azoXML");

        DebugDataMediator.setDebugData(this.debugData);

        this.gameSceneGeneralSupervision = new GameSceneGeneralSupervision(this);
        this.gameSceneGeneralSupervision.setupSupervision();
        if (Util.isDebugEnv()) {
            const view = new DebugView(this.debugData);
            view.setup();
        }

        if (Util.isDebugEnv()) {
            this.input.keyboard.on('keydown-N', () => {
                Logger.debug("n")
                this.doStepOnce = true;
            });
        }
    }

    // @ts-ignore: デバッグ用
    private busyWait(ms: number) {
        const start = performance.now();
        while (performance.now() - start < ms) { }
    }

    update(_time: number, _delta: number) {
        if (this.isDebugStepMode && !this.doStepOnce) {
            return; // スキップ（何もせず）
        }

        let now = performance.now();
        const gameSceneGeneralSupervision = this.gameSceneGeneralSupervision;
        gameSceneGeneralSupervision.updatePerFrame();
        this.debugData.frameDelta = _delta;
        this.debugData.updateDuration = performance.now() - now;
        
        if (this.isDebugStepMode) {
            this.doStepOnce = false;
        }
    }

    getParams() {
        return this.params;
    }

    getBestRecord() {
        return this.bestRecoed;
    }
}