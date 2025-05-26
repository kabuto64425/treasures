import { GameScene } from "./gameScene"
import { Player } from "./player"
import * as GameConstants from "./gameConstants"
import { FieldEvalution } from "./fieldEvalution";
import { Enemy } from "./enemy";
import { RoundsSupervision } from "./roundsSupervision";
import { Ui } from "./ui";
import { Recorder, RecorderMediator } from "./recoder";
import { InputCoordinator } from "./inputCoordinator";
import * as Util from "./utils"
import { Logger } from "./logger";
import { DebugDataMediator } from "./debugData";

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

    private updateBestRecord: (isGameComplete: boolean, currentNumberOfCollectedTreasures: number, currentElapedFrame: number) => boolean;

    private static readonly GAME_STATE = {
        INITIALIZED: -1,
        STANDBY: 0,
        READY: 1,
        PLAYING: 2,
        GAME_COMPLETE: 3,
        GAME_OVER: 4,
        PAUSE: 5
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
        this.fieldEvaluation = new FieldEvalution(this.gameObjectFactory, this.params.visibleFieldEvaluation);

        // 敵
        this.enemyList = [];
        for (let i = 0; i < GameConstants.numberOfEnemyies; i++) {
            const enemy = new Enemy(this.gameObjectFactory, GameConstants.parametersOfEnemies[i].row, GameConstants.parametersOfEnemies[i].column,
                this.params.enemyMoveCost, GameConstants.parametersOfEnemies[i].priorityScanDirections, this.onPlayerCaptured,
                this.player.getFootPrint().getFirstPrint, this.player.getFootPrint().onSteppedOnByEnemy
            );
            this.enemyList.push(enemy);
        }

        // ラウンド進行監督
        this.roundsSupervision = new RoundsSupervision(this.gameObjectFactory, this.onGameCompleted);
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

        if (this.params.enableVisibleRoomRanges) {
            const roomGraphics = this.gameObjectFactory.graphics({
                lineStyle: { width: 1, color: 0x000000, alpha: 1 },
                fillStyle: { color: 0xffffff, alpha: 1 },
            });
            roomGraphics.setDepth(-1);
            for (let i = 0; i < GameConstants.H; i++) {
                for (let j = 0; j < GameConstants.W; j++) {
                    const roomRow = Util.findRoomRowIndex(i);
                    const roomColumn = Util.findRoomColumnIndex(j);

                    // 2次元グラデーション
                    const ratioY = roomRow / (GameConstants.ROOM_ROW_COUNT); // 縦方向の割合
                    const ratioX = roomColumn / (GameConstants.ROOM_COLUMN_COUNT); // 横方向の割合

                    // 左上(赤)→右下(青)のグラデーション
                    const r = Math.round(255 * (1 - ratioX) * (1 - ratioY));
                    const g = Math.round(255 * ratioX * (1 - ratioY));
                    const b = Math.round(255 * ratioY);

                    const color = (r << 16) | (g << 8) | b;

                    Logger.debug(roomColumn + roomRow * GameConstants.ROOM_COLUMN_COUNT, color, roomRow, roomColumn);

                    roomGraphics.fillStyle(color, 0.5);
                    roomGraphics.fillRect(j * GameConstants.GRID_SIZE, i * GameConstants.GRID_SIZE, GameConstants.GRID_SIZE, GameConstants.GRID_SIZE);
                }
            }
        }

        this.gameObjectFactory.text(3 * GameConstants.GRID_SIZE + 5, 0 * GameConstants.GRID_SIZE, "↑", { fontSize: "22px", color: "#000000" });
        this.gameObjectFactory.text(4 * GameConstants.GRID_SIZE + 5, 0 * GameConstants.GRID_SIZE, "↑", { fontSize: "22px", color: "#000000" });
        this.gameObjectFactory.text(37 * GameConstants.GRID_SIZE + 5, 0 * GameConstants.GRID_SIZE, "↑", { fontSize: "22px", color: "#000000" });
        this.gameObjectFactory.text(38 * GameConstants.GRID_SIZE + 5, 0 * GameConstants.GRID_SIZE, "↑", { fontSize: "22px", color: "#000000" });

        this.gameObjectFactory.text(3 * GameConstants.GRID_SIZE + 5, 31 * GameConstants.GRID_SIZE, "↓", { fontSize: "22px", color: "#000000" });
        this.gameObjectFactory.text(4 * GameConstants.GRID_SIZE + 5, 31 * GameConstants.GRID_SIZE, "↓", { fontSize: "22px", color: "#000000" });
        this.gameObjectFactory.text(37 * GameConstants.GRID_SIZE + 5, 31 * GameConstants.GRID_SIZE, "↓", { fontSize: "22px", color: "#000000" });
        this.gameObjectFactory.text(38 * GameConstants.GRID_SIZE + 5, 31 * GameConstants.GRID_SIZE, "↓", { fontSize: "22px", color: "#000000" });

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
        DebugDataMediator.setEnemiesDebugValue(
            this.enemyList.map(e => {return e.getPlayerDebugValueData()})
        );

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
            enemy.resolvePlayerFrame(this.fieldEvaluation);
            enemy.draw();
        }
        DebugDataMediator.setEnemiesDebugValue(
            this.enemyList.map(e => {return e.getPlayerDebugValueData()})
        );

        for (const treasure of this.roundsSupervision.getCurrentRoundSupervision().extractAppearanceTreasures()) {
            this.player.handleCollisionWith(treasure);
        }

        // 宝の数が更新されるから
        this.ui.updateCollectedTreasuresText();

        // ラウンド進行
        this.roundsSupervision.updateProgressPerFrame();

        // 敵との接触判定・ゲームオーバー更新
        for (const enemy of this.enemyList) {
            this.player.handleCollisionWith(enemy);
        }
    }

    readonly pauseGame = () => {
        this.overlay.clear();
        this.overlay.fillStyle(0xffffff, 0.5).fillRect(0, 0, GameConstants.FIELD_WIDTH, GameConstants.FIELD_HEIGHT);
        this.overlay.setDepth(99);
        this.gameState = GameSceneGeneralSupervision.GAME_STATE.PAUSE;

        this.enemyList.forEach(enemy => {
            enemy.hide();
        });

        this.roundsSupervision.getCurrentRoundSupervision().handlePause();
    }

    readonly resumeGame = () => {
        this.overlay.clear();
        this.gameState = GameSceneGeneralSupervision.GAME_STATE.PLAYING;

        this.enemyList.forEach(enemy => {
            enemy.show();
        });

        this.roundsSupervision.getCurrentRoundSupervision().handleResume();
    }

    getInputCoordinator() {
        return this.inputCoordinator;
    }

    // onPlayerCapturedは、「プレーヤーが捕まる」という認識でいいらしい by chatgpt
    readonly onPlayerCaptured = () => {
        if (!this.params.noGameOverMode) {
            this.overlay.clear();
            this.overlay.fillStyle(0xd20a13, 0.5).fillRect(0, 0, GameConstants.FIELD_WIDTH, GameConstants.FIELD_HEIGHT);
            this.overlay.setDepth(99);
            this.ui.showGameOverText();
            this.gameState = GameSceneGeneralSupervision.GAME_STATE.GAME_OVER;
            this.updateBestRecord(this.isGameComplete(), this.recorder.getNumberOfCollectedTreasures(), this.recorder.getElapsedFrame());
            this.ui.updateBestRecordText();
        }
    }

    readonly onGameCompleted = () => {
        this.ui.showCongratulationsText();

        this.gameState = GameSceneGeneralSupervision.GAME_STATE.GAME_COMPLETE;
        this.updateBestRecord(this.isGameComplete(), this.recorder.getNumberOfCollectedTreasures(), this.recorder.getElapsedFrame());
        this.ui.updateBestRecordText();
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

    private isGameComplete = () => {
        return this.gameState === GameSceneGeneralSupervision.GAME_STATE.GAME_COMPLETE;
    }

    readonly isPause = () => {
        return this.gameState === GameSceneGeneralSupervision.GAME_STATE.PAUSE;
    }

    readonly setPause = () => {
        this.gameState = GameSceneGeneralSupervision.GAME_STATE.PAUSE;
    }

    readonly hasGameStarted = () => {
        return this.isPlaying() || this.isGameOver() || this.isGameComplete() || this.isPause();
    }
}
