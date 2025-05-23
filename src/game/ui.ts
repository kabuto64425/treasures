import * as Utils from "./utils"
import * as GameConstants from "./gameConstants";
import { BestRecord } from "./bestRecord";
import { GameSceneGeneralSupervision } from "./gameSceneGeneralSupervision";
import { RetryLongButton } from "./retryLongButton";
import { Logger } from "./logger";

export class Ui {
    private readonly clock: Phaser.Time.Clock;
    private readonly scenePlugin: Phaser.Scenes.ScenePlugin;

    private readonly uiLayer: Phaser.GameObjects.Layer;

    private readonly readyGoText: Phaser.GameObjects.BitmapText;

    private readonly timeText: Phaser.GameObjects.BitmapText;
    private readonly collectedTreasuresText: Phaser.GameObjects.BitmapText;

    private readonly gameOverText: Phaser.GameObjects.BitmapText;
    private readonly congratulationsText: Phaser.GameObjects.BitmapText;

    private readonly progressBox: Phaser.GameObjects.Graphics;
    private readonly progressBar: Phaser.GameObjects.Graphics;

    private readonly play: Phaser.GameObjects.Image;

    private timerEvent: Phaser.Time.TimerEvent;

    private readonly retryLongButton: RetryLongButton;

    private readonly deleteRecord: Phaser.GameObjects.Image;

    private readonly bestRecordText: Phaser.GameObjects.BitmapText;

    private readonly barWidth = 250;
    private readonly barHeight = 20;

    private readonly isStandby: () => boolean;
    private readonly setReady: () => void;

    private readonly pauseGame: () => void;
    private readonly resumeGame: () => void;

    private readonly isPlaying: () => boolean;
    private readonly isPause: () => boolean;

    private readonly queryCurrentRecord: () => {
        elapsedFrame: number,
        numberOfCollectedTreasures: number
    };

    private readonly createBestRecordStr: () => string;
    private readonly deleteBestRecord: () => void;

    private readonly requestStartGameFromUi: () => void;

    private readonly getApprovedActionInfo: () => {
        startGame: boolean,
        pauseGame: boolean,
        retryGame: boolean,
    };

    constructor(generalSupervision: GameSceneGeneralSupervision, gameObjectFactory: Phaser.GameObjects.GameObjectFactory, gameObjectCreator: Phaser.GameObjects.GameObjectCreator, clock: Phaser.Time.Clock, scenePlugin: Phaser.Scenes.ScenePlugin, bestRecord: BestRecord) {
        this.clock = clock;
        this.scenePlugin = scenePlugin;

        this.isStandby = generalSupervision.isStandby;
        this.setReady = generalSupervision.setReady;

        this.pauseGame = generalSupervision.pauseGame;
        this.resumeGame = generalSupervision.resumeGame;

        this.isPlaying = generalSupervision.isPlaying;
        this.isPause = generalSupervision.isPause;

        this.queryCurrentRecord = generalSupervision.queryCurrentRecord;

        this.createBestRecordStr = bestRecord.createBestRecordStr;
        this.deleteBestRecord = bestRecord.deleteBestRecord;

        this.requestStartGameFromUi = generalSupervision.getInputCoordinator().requestStartGameFromUi;
        this.getApprovedActionInfo = generalSupervision.getInputCoordinator().getApprovedActionInfo;

        this.uiLayer = gameObjectFactory.layer();
        this.uiLayer.setDepth(100);

        this.play = gameObjectCreator.image({ x: 214, y: 214, key: "play" }, false);
        this.uiLayer.add(this.play);

        this.timerEvent = new Phaser.Time.TimerEvent({
            delay: 0,
            repeat: GameConstants.FPS - 1,
            callbackScope: this,
            callback: function (this: Ui) {
                const remainingCount = this.timerEvent.getRepeatCount();
                const progress = remainingCount / GameConstants.FPS;

                this.progressBar.clear();
                this.progressBar.fillStyle(0xffff00, 0.8);
                this.progressBar.fillRect(0, 0, this.barWidth * progress, this.barHeight);

                if (remainingCount <= 0) {
                    this.readyGoText.setText("GO");
                    this.progressBar.destroy();
                    this.progressBox.destroy();

                    this.clock.delayedCall(GameConstants.READY_DISPLAY_DURATION, () => {
                        this.readyGoText.destroy();
                        generalSupervision.startGame();
                    });
                }
            },
        });

        this.readyGoText = gameObjectCreator.bitmapText({ x: 214, y: 214, font: "font", text: "READY" }, false);
        this.readyGoText.setVisible(false);
        this.uiLayer.add(this.readyGoText);

        this.progressBox = gameObjectCreator.graphics({ x: 214, y: 320 }, false);
        this.progressBox.setVisible(false);
        this.progressBox.fillStyle(0x222222, 0.8);
        this.progressBox.fillRect(0, 0, this.barWidth, this.barHeight);
        this.uiLayer.add(this.progressBox);

        this.progressBar = gameObjectCreator.graphics({ x: 214, y: 320 }, false);
        this.progressBar.setVisible(false);
        this.progressBar.fillStyle(0xffff00, 0.8);
        this.progressBar.fillRect(0, 0, this.barWidth, this.barHeight);
        this.uiLayer.add(this.progressBar);

        this.retryLongButton = new RetryLongButton(generalSupervision, this.uiLayer, this.clock, this.scenePlugin, gameObjectCreator);

        this.deleteRecord = gameObjectCreator.image({ x: 1195, y: 550, key: "delete" }, false);
        this.deleteRecord.setScale(0.7);
        this.uiLayer.add(this.deleteRecord);

        this.timeText = gameObjectCreator.bitmapText({ x: 970, y: 10, font: "font", text: "0:00.000" }, false);
        this.timeText.setScale(0.4);
        this.uiLayer.add(this.timeText);

        this.collectedTreasuresText = gameObjectCreator.bitmapText({ x: 970, y: 92, font: "font", text: `0/${Utils.calculateNumberOfTreasuresInALLRounds()}` }, false);
        this.collectedTreasuresText.setScale(0.4);
        this.uiLayer.add(this.collectedTreasuresText);

        this.gameOverText = gameObjectCreator.bitmapText({ x: 970, y: 174, font: "font", text: "GAME OVER!" }, false);
        this.gameOverText.setVisible(false);
        this.gameOverText.setScale(0.4);
        this.uiLayer.add(this.gameOverText);

        this.congratulationsText = gameObjectCreator.bitmapText({ x: 970, y: 174, font: "font", text: "CONGRATULATIONS!" }, false);
        this.congratulationsText.setVisible(false);
        this.congratulationsText.setScale(0.4);
        this.uiLayer.add(this.congratulationsText);

        const bestText = gameObjectCreator.bitmapText({ x: 970, y: 256, font: "font", text: "BEST" }, false);
        this.uiLayer.add(bestText);
        bestText.setScale(0.4);
        this.bestRecordText = gameObjectCreator.bitmapText({ x: 970, y: 338, font: "font", text: this.createBestRecordStr() }, false);
        this.bestRecordText.setScale(0.4);
        this.uiLayer.add(this.bestRecordText);
    }

    setupPlayButton() {
        this.play.setInteractive();

        this.play.on("pointerover", () => this.play.setTint(0x44ff44));
        this.play.on("pointerout", () => this.play.clearTint());

        this.play.on("pointerup", () => {
            Logger.debug("pointerup");
            this.requestStartGameFromUi();
        });
    }

    setupRetryLongButton() {
        this.retryLongButton.setupButton();
    }

    setupDeleteRecordButton() {
        this.deleteRecord.setInteractive();

        this.deleteRecord.on("pointerover", () => this.deleteRecord.setTint(0x44ff44));
        this.deleteRecord.on("pointerout", () => this.deleteRecord.clearTint());

        this.deleteRecord.on("pointerdown", () => {
            this.deleteBestRecord();
            this.updateBestRecordText();
        });
    }

    handleApprovedAction() {
        const approvedActionInfo = this.getApprovedActionInfo();
        if (approvedActionInfo.startGame) {
            if (this.isStandby()) {
                Logger.debug("startgame");
                this.executeStartGameAction();
            }
        }

        if (approvedActionInfo.pauseGame) {
            if (this.isPlaying()) {
                Logger.debug("pause");
                this.pauseGame();
            } else if (this.isPause()) {
                Logger.debug("resume");
                this.resumeGame();
            }
        }

        this.retryLongButton.handleApprovedAction(approvedActionInfo.retryGame);
    }

    private executeStartGameAction() {
        this.setReady();
        this.play.destroy();
        this.readyGoText.setVisible(true);
        this.progressBox.setVisible(true);
        this.progressBar.setVisible(true);

        this.clock.addEvent(this.timerEvent);
    }

    updateTimeText() {
        this.timeText.setText(`${Utils.createFormattedTimeFromFrame(this.queryCurrentRecord().elapsedFrame)}`);
    }

    updateCollectedTreasuresText() {
        const numberOfCollectedTreasures = this.queryCurrentRecord().numberOfCollectedTreasures;
        this.collectedTreasuresText.setText(`${numberOfCollectedTreasures}/${Utils.calculateNumberOfTreasuresInALLRounds()}`);
    }

    updateBestRecordText() {
        this.bestRecordText.setText(this.createBestRecordStr());
    }

    showGameOverText() {
        this.gameOverText.setVisible(true);
    }

    showCongratulationsText() {
        this.congratulationsText.setVisible(true);
    }
}