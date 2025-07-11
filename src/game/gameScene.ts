import Phaser from "phaser";
import { GameSceneGeneralSupervision } from "./gameSceneGeneralSupervision";
import { BestRecord } from "./bestRecord";
import { DebugData, DebugDataMediator } from "./debugData";
import * as Util from "./utils";
import { SceneContext } from "./sceneContext";
import { WrapArrowFactory } from "./wrapArrowFactory";
import { GameSceneContainerContext } from "./gameSceneContainerContext";
import { VirtualStickInput } from "./virtualStickInput";
//import { DebugView } from "./debugView";
import { Logger } from "./logger";
import { GameSceneSoundContext } from "./gameSceneSoundContext";
import * as GameConstants from "./gameConstants";
import { Queue } from "./queue";

export class GameScene extends Phaser.Scene {

    private readonly params: any;
    private readonly bestRecoed: BestRecord;

    private readonly evaluationMap: Map<string, Uint8Array>;
    private readonly preEvalutatePriorityPositionQueue: Queue<Util.Position>;

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

        this.evaluationMap = new Map<string, Uint8Array>();
        this.preEvalutatePriorityPositionQueue = this.createPreEvalutatePriorityPositionQueue();

        this.debugData = new DebugData();
    }

    private createPreEvalutatePriorityPositionQueue() {
        Logger.debug("createPreEvalutatePriorityPositionQueue");
        const preEvalutatePriorityPositionQueue = new Queue<Util.Position>();
        for (const [, waypoints] of Object.entries(GameConstants.ENEMY_SEARCH_WAYPOINTS)) {
            for (const waypoint of waypoints) {
                preEvalutatePriorityPositionQueue.enqueue(waypoint);
            }
        }

        for (let row = 0; row < GameConstants.H; row++)for (let column = 0; column < GameConstants.W; column++) {
            preEvalutatePriorityPositionQueue.enqueue({ row: row, column: column });
        }

        return preEvalutatePriorityPositionQueue;
    }

    preload() {
        //https://cdn.phaserfiles.com/v385/assets/atlas/bitmap-fonts-debug.png
        //https://cdn.phaserfiles.com/v385/assets/atlas/bitmap-fonts.json
        //https://cdn.phaserfiles.com/v385/assets/fonts/bitmap/azo-fire.xml
        //this.load.atlas("fontatlas", "./bitmap-fonts-debug.png", "./bitmap-fonts.json");
        //this.load.xml("azoXML", "./azo-fire.xml");

        //https://cdn.phaserfiles.com/v385/assets/ui/nine-slice.png
        //https://cdn.phaserfiles.com/v385/assets/ui/nine-slice.json
        //this.load.atlas('ui', 'nine-slice.png', 'nine-slice.json');

        //https://icon-rainbow.com/
        this.load.image("play", "./play.png");
        this.load.image("pause", "./pause.png");
        // おそらくrestartというキーが使えなさそう。なので、restart_で代用
        this.load.image("restart_", "./restart.png");
        this.load.image("delete", "./delete.png");
        this.load.image("help", "./help.png");

        // https://pipoya.net/sozai/assets/icon/icon-image/
        this.load.spritesheet('emotion', './pipo-emotion.png', {
            frameWidth: 32,  // 1アイコンの幅
            frameHeight: 32, // 1アイコンの高さ
        });

        // https://dot-illust.net/category/character/page/8/
        //this.load.image('renga_gray', './block_renga_gray.svg');
        this.load.image('goal', './goal.png');
        this.load.image("batsu", "./batsu.png");

        //オリジナル素材とダミー素材
        this.load.image('player', './player_2.png');
        this.load.image('treasure', './treasure.png');
        this.load.image('enemy', './enemy.png');
        this.load.image('dummy', './dummy.png');

        // フォント(htmlに記述だが、素材URLは1箇所にまとめたいのでここに記載)
        //https://booth.pm/ja/items/2747965

        // サウンド
        //https://www.springin.org/sound-stock/category/retrogame/
        this.load.audio('collect', ['sound/collect.mp3']);
        this.load.audio('finalRound', ['sound/finalRound.mp3']);
        this.load.audio('go', ['sound/go.mp3']);
        this.load.audio('lose', ['sound/lose.mp3']);
        this.load.audio('roundUp', ['sound/roundUp.mp3']);
        this.load.audio('win', ['sound/win.mp3']);
    }

    create() {
        //Phaser.GameObjects.BitmapText.ParseFromAtlas(this, "font", "fontatlas", "azo-fire", "azoXML");

        DebugDataMediator.setDebugData(this.debugData);
        SceneContext.setup(this);
        // ゲーム音量を控え目にしておく。
        // 不快に思われないようにしたいから。
        SceneContext.sound.volume = 0.015;
        // GameSceneContainerContext, WrapArrowFactoryは
        // 必ずSceneContext.setup(this)よりも後にセットアップすること
        GameSceneContainerContext.setup();
        VirtualStickInput.setup(this, GameSceneContainerContext.leftContainer);
        WrapArrowFactory.setup();
        GameSceneSoundContext.setup();

        this.gameSceneGeneralSupervision = new GameSceneGeneralSupervision(this);
        this.gameSceneGeneralSupervision.setupSupervision();
        /*if (Util.isDebugEnv()) {
            const view = new DebugView(this.debugData);
            view.setup();
            this.events.once("shutdown", () => {
                // restartしたときに、destroyしておかないとrestart前のデバッグビューが残り
                // restartを繰り返すうちに処理が重くなるから
                view.destroy();
            });
        }*/
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

        if (this.game.loop.actualFps < 50) {
            Logger.debug("fps under 50");
        }

        if (this.isDebugStepMode) {
            this.doStepOnce = false;
        }

        this.debugData.scaleX = this.scale.displayScale.x;
        this.debugData.scaleY = this.scale.displayScale.y;
    }

    getParams() {
        return this.params;
    }

    getBestRecord() {
        return this.bestRecoed;
    }

    readonly getEvaluationMap = () => {
        return this.evaluationMap;
    }

    readonly getPreEvalutatePriorityPositionQueue = () => {
        return this.preEvalutatePriorityPositionQueue;
    }
}