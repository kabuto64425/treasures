import { GameScene } from "./gameScene"
import { Player } from "./player"
import * as GameConstants from "./gameConstants"
import { FieldEvaluation } from "./fieldEvaluation";
import { RoundsSupervision } from "./roundsSupervision";
import { Ui } from "./ui";
import { Recorder, RecorderMediator } from "./recoder";
import { InputCoordinator } from "./inputCoordinator";
import * as Util from "./utils"
import { Logger } from "./logger";
import { EnemiesSupervision } from "./enemiesSupervision";
import { SceneServices } from "./sceneServices";

export class GameSceneGeneralSupervision {
    private readonly params: any;

    private readonly inputCoordinator: InputCoordinator;

    private readonly ui: Ui;

    private readonly player: Player;
    private readonly fieldEvaluation: FieldEvaluation;
    private readonly enemiesSupervision: EnemiesSupervision
    private roundsSupervision: RoundsSupervision;
    private gameState: number;

    private readonly recorder: Recorder;

    private fieldContainer: Phaser.GameObjects.Container;
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
        this.fieldContainer = SceneServices.add.container();

        this.params = scene.getParams();

        this.updateBestRecord = scene.getBestRecord().updateBestRecord;

        this.recorder = new Recorder();

        this.gameState = GameSceneGeneralSupervision.GAME_STATE.INITIALIZED;

        this.inputCoordinator = new InputCoordinator();

        // ゲームオーバー等に表示するオーバレイ
        this.overlay = SceneServices.make.graphics({})

        this.ui = new Ui(this, scene.getBestRecord());

        // プレイヤー
        this.player = new Player(GameConstants.parameterPlayer.row, GameConstants.parameterPlayer.column, this.params);

        //フィールド評価
        this.fieldEvaluation = new FieldEvaluation(this.player.getFootPrint().getFirstPrint);

        // ラウンド進行監督
        this.roundsSupervision = new RoundsSupervision(this.onGameCompleted);

        // 敵
        this.enemiesSupervision = new EnemiesSupervision(
            this.params, this.onPlayerCaptured,
            this.player.getFootPrint(), this.fieldEvaluation.isShortestDirection,
            this.player.getRoomId, this.roundsSupervision.isFinalRound,
            this.roundsSupervision.extractCurrentAppearanceTreasures
        );
    }

    setupSupervision() {
        this.gameState = GameSceneGeneralSupervision.GAME_STATE.STANDBY;
        this.fieldContainer.setPosition(30, 8);
        RecorderMediator.setRecoder(this.recorder);

        this.ui.setupPlayButton();
        this.ui.setupRetryLongButton();
        this.ui.setupDeleteRecordButton(this.overlay);

        // フィールド描画
        const fieldGraphics = SceneServices.make.graphics({
            lineStyle: { width: 1, color: 0x000000, alpha: 1 },
            fillStyle: { color: 0xffffff, alpha: 1 }
        });
        for (let i = 0; i < GameConstants.H; i++) {
            for (let j = 0; j < GameConstants.W; j++) {
                fieldGraphics.strokeRect(j * GameConstants.GRID_SIZE, i * GameConstants.GRID_SIZE, GameConstants.GRID_SIZE, GameConstants.GRID_SIZE);
            }
        }
        this.fieldContainer.add(fieldGraphics);

        if (this.params.enableVisibleRoomRanges) {
            const roomGraphics = SceneServices.make.graphics({
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
            this.fieldContainer.add(roomGraphics);
        }

        this.fieldContainer.add(SceneServices.make.text({ x: 3 * GameConstants.GRID_SIZE + 5, y: 0 * GameConstants.GRID_SIZE, text: "↑", style: { fontSize: "22px", color: "#000000" } }));
        this.fieldContainer.add(SceneServices.make.text({ x: 4 * GameConstants.GRID_SIZE + 5, y: 0 * GameConstants.GRID_SIZE, text: "↑", style: { fontSize: "22px", color: "#000000" } }));
        this.fieldContainer.add(SceneServices.make.text({ x: 37 * GameConstants.GRID_SIZE + 5, y: 0 * GameConstants.GRID_SIZE, text: "↑", style: { fontSize: "22px", color: "#000000" } }));
        this.fieldContainer.add(SceneServices.make.text({ x: 38 * GameConstants.GRID_SIZE + 5, y: 0 * GameConstants.GRID_SIZE, text: "↑", style: { fontSize: "22px", color: "#000000" } }));

        this.fieldContainer.add(SceneServices.make.text({ x: 3 * GameConstants.GRID_SIZE + 5, y: 31 * GameConstants.GRID_SIZE, text: "↓", style: { fontSize: "22px", color: "#000000" } }));
        this.fieldContainer.add(SceneServices.make.text({ x: 4 * GameConstants.GRID_SIZE + 5, y: 31 * GameConstants.GRID_SIZE, text: "↓", style: { fontSize: "22px", color: "#000000" } }));
        this.fieldContainer.add(SceneServices.make.text({ x: 37 * GameConstants.GRID_SIZE + 5, y: 31 * GameConstants.GRID_SIZE, text: "↓", style: { fontSize: "22px", color: "#000000" } }));
        this.fieldContainer.add(SceneServices.make.text({ x: 38 * GameConstants.GRID_SIZE + 5, y: 31 * GameConstants.GRID_SIZE, text: "↓", style: { fontSize: "22px", color: "#000000" } }));

        // 壁描画
        for (let i = 0; i < GameConstants.H; i++) {
            for (let j = 0; j < GameConstants.W; j++) {
                if (GameConstants.FIELD[i][j] === 1) {
                    const fillRect = SceneServices.make.graphics({
                        lineStyle: { width: 1, color: 0x000000, alpha: 1 },
                        fillStyle: { color: 0x000000, alpha: 1 }
                    }).fillRect(j * GameConstants.GRID_SIZE, i * GameConstants.GRID_SIZE, GameConstants.GRID_SIZE, GameConstants.GRID_SIZE);
                    this.fieldContainer.add(fillRect);
                }
            }
        }

        // プレイヤー
        this.player.setup(this.fieldContainer, this.recorder.getElapsedFrame(), this.params.visibleFootPrint);

        // フィールド評価
        this.fieldEvaluation.setup(this.fieldContainer, this.params.visibleFieldEvaluation);

        // ゲーム進行管理
        this.roundsSupervision.setup(this.fieldContainer);

        // 敵
        this.enemiesSupervision.setup(this.fieldContainer);
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
        // プレイヤーのターン
        this.player.resolvePlayerFrame(playerDirection, this.recorder.getElapsedFrame());

        // 敵との接触判定・ゲームオーバー更新
        for (const enemy of this.enemiesSupervision.getEnemyList()) {
            this.player.handleCollisionWith(enemy);
        }

        // 敵と接触しているとゲームステータスが変わるから
        if (!this.isPlaying()) {
            return;
        }

        for (const treasure of this.roundsSupervision.extractCurrentAppearanceTreasures()) {
            this.player.handleCollisionWith(treasure);
        }

        // 宝の数が更新されるから
        this.ui.updateCollectedTreasuresText();

        // ラウンド進行
        this.roundsSupervision.updateProgressPerFrame();

        // ゲームをクリアしているとゲームステータスが変わるから
        if (!this.isPlaying()) {
            return;
        }

        // プレイヤーのターン終了

        // 敵のターン
        // フィールド評価
        this.fieldEvaluation.resolveFrame();

        // 敵
        this.enemiesSupervision.resolveFrame();

        // 敵との接触判定・ゲームオーバー更新
        for (const enemy of this.enemiesSupervision.getEnemyList()) {
            this.player.handleCollisionWith(enemy);
        }

        // 敵と接触しているとステータスが変わるから
        // 意味はないが、ゲームステータスが変わるから書いとく
        if (!this.isPlaying()) {
            return;
        }
        // 敵のターン終了
    }

    readonly pauseGame = () => {
        this.overlay.clear();
        this.overlay.fillStyle(0xffffff, 0.5).fillRect(0, 0, GameConstants.FIELD_WIDTH, GameConstants.FIELD_HEIGHT);
        this.overlay.setDepth(99);
        this.gameState = GameSceneGeneralSupervision.GAME_STATE.PAUSE;

        this.enemiesSupervision.handlePause();
        this.roundsSupervision.getCurrentRoundSupervision().handlePause();
    }

    readonly resumeGame = () => {
        this.overlay.clear();
        this.gameState = GameSceneGeneralSupervision.GAME_STATE.PLAYING;

        this.enemiesSupervision.handleResume();
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

    readonly restartGame = () => {
        SceneServices.scenePlugin.restart();
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
