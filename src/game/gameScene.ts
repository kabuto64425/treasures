import Phaser from "phaser";
import { GameSceneGeneralSupervision } from "./gameSceneGeneralSupervision";
import { BestRecord } from "./bestRecord";
import { DebugView } from "./debugView";
import { DebugData, DebugDataMediator } from "./debugData";
import * as Util from "./utils";
import { SceneContext } from "./sceneContext";
import { WrapArrowFactory } from "./wrapArrowFactory";
import { GameSceneContainerContext } from "./gameSceneContainerContext";

export class GameScene extends Phaser.Scene {

    private readonly params: any;
    private readonly bestRecoed: BestRecord;

    // create内で、必ず初期化しておくこと
    private gameSceneGeneralSupervision!: GameSceneGeneralSupervision;

    private debugData: DebugData;

    private isDebugStepMode;
    private doStepOnce = false;

    constructor(params: any, bestRecord: BestRecord) {
        super("gameScene");
        this.params = params;
        // デバッグステップモードは、開発環境でしか使用できないようにする
        this.isDebugStepMode = Util.isDebugEnv() && (this.params.isDebugStepMode ?? false);
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
        this.load.image("play", "/treasures/play.png");
        this.load.image("pause", "/treasures/pause.png");
        // おそらくrestartというキーが使えなさそう。なので、restart_で代用
        this.load.image("restart_", "/treasures/restart.png");
        this.load.image("delete", "/treasures/delete.png");

        // https://pipoya.net/sozai/assets/icon/icon-image/
        this.load.spritesheet('emotion', '/treasures/pipo-emotion.png', {
            frameWidth: 32,  // 1アイコンの幅
            frameHeight: 32, // 1アイコンの高さ
        });

        // https://dot-illust.net/category/character/page/8/
        this.load.image('renga_gray', '/treasures/block_renga_gray.svg');
        this.load.image('goal', '/treasures/goal.png');
        this.load.image("batsu", "/treasures/batsu.png");

        //オリジナル素材とダミー素材
        this.load.image('player', '/treasures/player_2.png');
        this.load.image('treasure', '/treasures/treasure.png');
        this.load.image('enemy', '/treasures/enemy.png');
        this.load.image('dummy', '/treasures/dummy.png');

        // フォント(htmlに記述だが、素材URLは1箇所にまとめたいのでここに記載)
        //https://booth.pm/ja/items/2747965
    }

    create() {
        Phaser.GameObjects.BitmapText.ParseFromAtlas(this, "font", "fontatlas", "azo-fire", "azoXML");

        DebugDataMediator.setDebugData(this.debugData);
        SceneContext.setup(this);
        // GameSceneContainerContext, WrapArrowFactoryは
        // 必ずSceneContext.setup(this)よりも後にセットアップすること
        GameSceneContainerContext.setup();
        WrapArrowFactory.setup();

        this.gameSceneGeneralSupervision = new GameSceneGeneralSupervision(this);
        this.gameSceneGeneralSupervision.setupSupervision();
        if (Util.isDebugEnv()) {
            const view = new DebugView(this.debugData);
            view.setup();
            this.events.once("shutdown", () => {
                // restartしたときに、destroyしておかないとrestart前のデバッグビューが残り
                // restartを繰り返すうちに処理が重くなるから
                view.destroy();
            });
        }
        if (this.isDebugStepMode) {
            this.input.keyboard.on('keydown-N', () => {
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
        this.debugData.fps = this.game.loop.actualFps.toFixed(1);

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