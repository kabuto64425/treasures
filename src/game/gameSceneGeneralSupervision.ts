import { GameScene } from "./gameScene";
import { Player } from "./player";
import * as GameConstants from "./gameConstants";
import { FieldEvaluation } from "./fieldEvaluation";
import { RoundsSupervision } from "./roundsSupervision";
import { Ui } from "./ui";
import { Recorder, RecorderMediator } from "./recoder";
import { InputCoordinator } from "./inputCoordinator";
import { EnemiesSupervision } from "./enemiesSupervision";
import { SceneContext } from "./sceneContext";
import { GameSceneOverlay } from "./gameSceneOverlay";
import { FieldSupervision } from "./fieldSupervision";

export class GameSceneGeneralSupervision {
    private readonly params: any;

    private readonly inputCoordinator: InputCoordinator;

    private readonly ui: Ui;

    private readonly fieldSupervision: FieldSupervision;
    private readonly player: Player;
    private readonly fieldEvaluation: FieldEvaluation;
    private readonly enemiesSupervision: EnemiesSupervision
    private roundsSupervision: RoundsSupervision;
    private gameState: number;

    private readonly recorder: Recorder;

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
        this.params = scene.getParams();

        this.updateBestRecord = scene.getBestRecord().updateBestRecord;

        this.recorder = new Recorder();

        this.gameState = GameSceneGeneralSupervision.GAME_STATE.INITIALIZED;

        this.inputCoordinator = new InputCoordinator();
        
        this.ui = new Ui(this, scene.getBestRecord());

        // フィールド監督
        this.fieldSupervision = new FieldSupervision(this.params);

        // プレイヤー
        this.player = new Player(GameConstants.parameterPlayer.row, GameConstants.parameterPlayer.column, this.params, this.fieldSupervision.isFloor);

        //フィールド評価
        this.fieldEvaluation = new FieldEvaluation(this.player.getFootPrint().getFirstPrint, this.fieldSupervision.isWall);

        // ラウンド進行監督
        this.roundsSupervision = new RoundsSupervision(this.onGameCompleted, this.fieldSupervision.isFloor, this.fieldSupervision.onFinalRound);

        // 敵
        this.enemiesSupervision = new EnemiesSupervision(
            this.params, this.onPlayerCaptured,
            this.player.getFootPrint(), this.fieldEvaluation.isShortestDirection,
            this.player.getRoomId, this.roundsSupervision.isFinalRound,
            this.roundsSupervision.extractCurrentAppearanceTreasures,
            this.fieldSupervision.isFloor
        );

    }

    setupSupervision() {
        this.gameState = GameSceneGeneralSupervision.GAME_STATE.STANDBY;
        RecorderMediator.setRecoder(this.recorder);
        GameSceneOverlay.setup();

        this.fieldSupervision.setup();

        this.ui.setupPlayButton();
        this.ui.setupReadyGoTextWithBar();
        this.ui.setupRetryLongButton();
        this.ui.setupDeleteBestRecordButton();

        // プレイヤー
        this.player.setup(this.recorder.getElapsedFrame(), this.params.visibleFootPrint);

        // フィールド評価
        this.fieldEvaluation.setup(this.params.visibleFieldEvaluation);

        // ゲーム進行管理
        this.roundsSupervision.setup();

        // 敵
        this.enemiesSupervision.setup();

        // 矢印よりもプレイヤーなどを後にコンテナにaddしているが、
        // 矢印を手前に持ってきたい。だからここで矢印を手前に持ってくる処理を入れる
        this.fieldSupervision.bringAllWrapAroundArrowsToTop();
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

        // フィールドの更新
        this.fieldSupervision.updatePerFrame(this.player.position());

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
        GameSceneOverlay.onPauseGame();
        this.gameState = GameSceneGeneralSupervision.GAME_STATE.PAUSE;

        this.fieldSupervision.handlePause();
        this.enemiesSupervision.handlePause();
        this.roundsSupervision.getCurrentRoundSupervision().handlePause();
    }

    readonly resumeGame = () => {
        GameSceneOverlay.onResumeGame();
        this.gameState = GameSceneGeneralSupervision.GAME_STATE.PLAYING;

        this.fieldSupervision.handleResume();
        this.enemiesSupervision.handleResume();
        this.roundsSupervision.getCurrentRoundSupervision().handleResume();
    }

    getInputCoordinator() {
        return this.inputCoordinator;
    }

    // onPlayerCapturedは、「プレーヤーが捕まる」という認識でいいらしい by chatgpt
    readonly onPlayerCaptured = () => {
        if (!this.params.noGameOverMode) {
            GameSceneOverlay.onPlayerCaptured();
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
        SceneContext.scenePlugin.restart();
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
