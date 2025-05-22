import { GameScene } from "./gameScene"
import { Player } from "./player"
import * as GameConstants from "./gameConstants"
import { FieldEvalution } from "./fieldEvalution";
import { Enemy } from "./enemy";
import { RoundsSupervision } from "./roundsSupervision";
import { Ui } from "./ui";
import { Recorder, RecorderMediator } from "./recoder";
import { InputCoordinator } from "./inputCoordinator";

export class GameSceneGeneralSupervision {
    // これを使用してゲームの物体を生成すると、シーンに自動的に加わる
    private readonly gameObjectFactory: Phaser.GameObjects.GameObjectFactory;

    private readonly inputPlugin: Phaser.Input.InputPlugin;

    private readonly params: any;

    private readonly inputCoordinator: InputCoordinator;

    private readonly ui: Ui;

    private readonly player: Player;
    private readonly fieldEvaluation: FieldEvalution;
    private readonly enemyList: Enemy[];
    private roundsSupervision: RoundsSupervision;
    private gameState: number;

    private readonly recorder: Recorder;

    private overlay: Phaser.GameObjects.Graphics;

    private updateBestRecord: (isGameClear: boolean, currentNumberOfCollectedTreasures: number, currentElapedFrame: number) => boolean;

    private static readonly GAME_STATE = {
        INITIALIZED: -1,
        STANDBY: 0,
        READY: 1,
        PLAYING: 2,
        GAME_CLEAR: 3,
        GAME_OVER: 4,
    };

    constructor(scene: GameScene) {
        this.gameObjectFactory = scene.add;
        this.inputPlugin = scene.input;
        // これを使用してゲームの物体を生成してもシーンには自動的に加わらない。どこかのレイヤーなどに加えるときに使用
        const gameObjectCreator = scene.make;
        this.params = scene.getParams();

        this.updateBestRecord = scene.getBestRecord().updateBestRecord;

        this.recorder = new Recorder();

        this.gameState = GameSceneGeneralSupervision.GAME_STATE.INITIALIZED;

        this.inputCoordinator = new InputCoordinator(this.inputPlugin);

        this.ui = new Ui(this, this.gameObjectFactory, gameObjectCreator, scene.time, scene.scene, scene.getBestRecord());

        // ゲームオーバー時に表示するオーバレイ
        this.overlay = this.gameObjectFactory.graphics();

        // プレイヤー
        this.player = new Player(this.gameObjectFactory, GameConstants.parameterPlayer.row, GameConstants.parameterPlayer.column, this.params);

        //フィールド評価
        this.fieldEvaluation = new FieldEvalution(scene.add, this.params.visibleFieldEvaluation);

        // 敵
        this.enemyList = [];
        for (let i = 0; i < GameConstants.numberOfEnemyies; i++) {
            const enemy = new Enemy(scene.add, GameConstants.parametersOfEnemies[i].row, GameConstants.parametersOfEnemies[i].column,
                this.params.enemyMoveCost, GameConstants.parametersOfEnemies[i].priorityScanDirections, this.onPlayerCaptured,
                this.player.getFootPrint().getFirstPrint, this.player.getFootPrint().onSteppedOnByEnemy
            );
            this.enemyList.push(enemy);
        }

        // ラウンド進行監督
        // +1でファイナルラウンドに対応しているのは暫定
        this.roundsSupervision = new RoundsSupervision(this.gameObjectFactory);
    }

    setupSupervision() {
        this.gameState = GameSceneGeneralSupervision.GAME_STATE.STANDBY;
        RecorderMediator.setRecoder(this.recorder);

        this.ui.setupPlayButton();
        this.ui.setupRetryLongButton();
        this.ui.setupDeleteRecordButton();

        // フィールド描画
        const fieldGraphics = this.gameObjectFactory.graphics({
            lineStyle: { width: 1, color: 0x000000, alpha: 1 },
            fillStyle: { color: 0xffffff, alpha: 1 }
        });
        for (let i = 0; i < GameConstants.H; i++) {
            for (let j = 0; j < GameConstants.W; j++) {
                fieldGraphics.strokeRect(j * GameConstants.GRID_SIZE, i * GameConstants.GRID_SIZE, GameConstants.GRID_SIZE, GameConstants.GRID_SIZE);
            }
        }

        // 壁描画
        for (let i = 0; i < GameConstants.H; i++) {
            for (let j = 0; j < GameConstants.W; j++) {
                if (GameConstants.FIELD[i][j] === 1) {
                    this.gameObjectFactory.graphics({
                        lineStyle: { width: 1, color: 0x000000, alpha: 1 },
                        fillStyle: { color: 0x000000, alpha: 1 }
                    }).fillRect(j * GameConstants.GRID_SIZE, i * GameConstants.GRID_SIZE, GameConstants.GRID_SIZE, GameConstants.GRID_SIZE);
                }
            }
        }


        this.overlay.fillStyle(0xd20a13, 0.5).fillRect(0, 0, GameConstants.D_WIDTH, GameConstants.D_HEIGHT);
        this.overlay.setDepth(99);
        this.overlay.setVisible(false);

        // プレイヤー描画
        this.player.setup(this.recorder.getElapsedFrame());
        this.player.draw();

        // フィールド評価
        this.fieldEvaluation.updateEvaluation(this.player.position().row, this.player.position().column);
        this.fieldEvaluation.draw();

        // 敵描画
        for (const enemy of this.enemyList) {
            enemy.draw();
        }

        // ゲーム進行管理
        this.roundsSupervision.setup();
    }

    startGame() {
        this.gameState = GameSceneGeneralSupervision.GAME_STATE.PLAYING;
        // 最初のラウンドの宝描画
        this.roundsSupervision.getCurrentRoundSupervision().startRound();
    }

    updatePerFrame() {
        this.inputCoordinator.handleKeyboardInputs();
        this.inputCoordinator.approveRequestedAction();
        this.ui.handleApprovedAction();
        if (!this.isPlaying()) {
            return;
        }
        this.recorder.addElapsedFrame();
        this.ui.updateTimeText();

        // input調整役から
        // 承認されたプレイヤーの方向を取得
        let playerDirection = this.inputCoordinator.getApprovedActionInfo().playerDirection;
        // プレイヤー
        this.player.resolvePlayerFrame(playerDirection, this.recorder.getElapsedFrame());
        this.player.draw();
        this.player.getFootPrint().draw();

        // フィールド評価
        this.fieldEvaluation.updateEvaluation(this.player.getFootPrint().getFirstPrint().row, this.player.getFootPrint().getFirstPrint().column);
        this.fieldEvaluation.draw();

        // 敵
        for (const enemy of this.enemyList) {
            if (enemy.isChargeCompleted()) {
                let enemyDist = enemy.decideMoveDirection(this.fieldEvaluation);
                enemy.move(enemyDist);
            } else {
                enemy.charge();
            }
            enemy.handleFirstFootprintStep();

            enemy.draw();
        }

        for (const treasure of this.roundsSupervision.getCurrentRoundSupervision().extractAppearanceTreasures()) {
            this.player.handleCollisionWith(treasure);
        }

        // 宝の数が更新されるから
        this.ui.updateCollectedTreasuresText();

        
        this.roundsSupervision.updateProgressPerFrame();

        // リファクタリングで、updateProgressPerFrame内で処理する
        // 次ラウンド進行判断・次ラウンド進行
        if (this.roundsSupervision.isCompletedCurrentRound()) {
            if (this.roundsSupervision.isFinalRound()) {
                this.ui.showCongratulationsText();

                this.gameState = GameSceneGeneralSupervision.GAME_STATE.GAME_CLEAR;
                this.updateBestRecord(this.isGameClear(), this.recorder.getNumberOfCollectedTreasures(), this.recorder.getElapsedFrame());
                this.ui.updateBestRecordText();
            } else {
                this.roundsSupervision.advanceRound();
                this.roundsSupervision.getCurrentRoundSupervision().startRound();
            }
        }

        // 敵との接触判定・ゲームオーバー更新
        for (const enemy of this.enemyList) {
            this.player.handleCollisionWith(enemy);
        }
    }

    getInputCoordinator() {
        return this.inputCoordinator;
    }

    // onPlayerCapturedは、「プレーヤーが捕まる」という認識でいいらしい by chatgpt
    readonly onPlayerCaptured = () => {
        if (!this.params.noGameOverMode) {
            this.overlay.setVisible(true);
            this.ui.showGameOverText();
            this.gameState = GameSceneGeneralSupervision.GAME_STATE.GAME_OVER;
            this.updateBestRecord(this.isGameClear(), this.recorder.getNumberOfCollectedTreasures(), this.recorder.getElapsedFrame());
            this.ui.updateBestRecordText();
        }
    }

    readonly queryCurrentRecord = () => {
        return {
            elapsedFrame: this.recorder.getElapsedFrame(),
            numberOfCollectedTreasures: this.recorder.getNumberOfCollectedTreasures()
        }
    }

    readonly isStandby = () => {
        return this.gameState === GameSceneGeneralSupervision.GAME_STATE.STANDBY;
    }

    readonly setReady = () => {
        this.gameState = GameSceneGeneralSupervision.GAME_STATE.READY;
    }

    readonly isPlaying = () => {
        return this.gameState === GameSceneGeneralSupervision.GAME_STATE.PLAYING;
    }

    private isGameOver = () => {
        return this.gameState === GameSceneGeneralSupervision.GAME_STATE.GAME_OVER;
    }

    private isGameClear = () => {
        return this.gameState === GameSceneGeneralSupervision.GAME_STATE.GAME_CLEAR;
    }

    readonly isGamePlayed = () => {
        return this.isPlaying() || this.isGameOver() || this.isGameClear();
    }
}
