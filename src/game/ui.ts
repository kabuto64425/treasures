import * as Utils from "./utils"
import * as GameConstants from "./gameConstants";
import { BestRecord } from "./bestRecord";
import { GameSceneGeneralSupervision } from "./gameSceneGeneralSupervision";
import { RetryLongButton } from "./retryLongButton";

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

    private readonly retry: Phaser.GameObjects.Image;

    private readonly retryLong: Phaser.GameObjects.Image;

    private retryLongTimerEvent: Phaser.Time.TimerEvent;

    private readonly deleteRecord: Phaser.GameObjects.Image;

    private readonly bestRecordText: Phaser.GameObjects.BitmapText;

    private readonly barWidth = 250;
    private readonly barHeight = 20;

    private readonly isGamePlayed: () => boolean;
    private readonly getElapsedFrame: () => number;
    private readonly queryNumberOfCollectedTreasures: () => number;

    private readonly createBestRecordStr: () => string;
    private readonly deleteBestRecord: () => void;

    constructor(generalSupervision: GameSceneGeneralSupervision, gameObjectFactory: Phaser.GameObjects.GameObjectFactory, gameObjectCreator: Phaser.GameObjects.GameObjectCreator, clock : Phaser.Time.Clock, scenePlugin :  Phaser.Scenes.ScenePlugin, bestRecord: BestRecord) {
        this.clock = clock;
        this.scenePlugin = scenePlugin;

        this.isGamePlayed = generalSupervision.isGamePlayed;
        this.getElapsedFrame = generalSupervision.getElapsedFrame;
        this.queryNumberOfCollectedTreasures = generalSupervision.queryNumberOfCollectedTreasures;

        this.createBestRecordStr = bestRecord.createBestRecordStr;
        this.deleteBestRecord = bestRecord.deleteBestRecord;

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

        this.retry = gameObjectCreator.image({ x: 800, y: 550, key: "retry" }, false);
        this.uiLayer.add(this.retry);

        this.retryLong = gameObjectCreator.image({ x: 400, y: 400, key: "retry" }, false);
        this.uiLayer.add(this.retryLong);

        this.retryLongTimerEvent = new Phaser.Time.TimerEvent({
            delay: 0,
            repeat: GameConstants.FPS - 1,
            callbackScope: this,
            callback: function (this: Ui) {
                console.log(this.retryLongTimerEvent.getRepeatCount());
            }
        });

        new RetryLongButton(this.uiLayer, gameObjectCreator);

        this.deleteRecord = gameObjectCreator.image({ x: 1000, y: 550, key: "delete" }, false);
        this.uiLayer.add(this.deleteRecord);

        this.timeText = gameObjectCreator.bitmapText({ x: 645, y: 50, font: "font", text: "0:00.000" }, false);
        this.uiLayer.add(this.timeText);

        this.collectedTreasuresText = gameObjectCreator.bitmapText({ x: 645, y: 132, font: "font", text: `0/${Utils.calculateNumberOfTreasuresInALLRounds()}` }, false);
        this.uiLayer.add(this.collectedTreasuresText);

        this.gameOverText = gameObjectCreator.bitmapText({ x: 645, y: 214, font: "font", text: "GAME OVER!" }, false);
        this.gameOverText.setVisible(false);
        this.uiLayer.add(this.gameOverText);

        this.congratulationsText = gameObjectCreator.bitmapText({ x: 645, y: 214, font: "font", text: "CONGRATULATIONS!" }, false);
        this.congratulationsText.setVisible(false);
        this.uiLayer.add(this.congratulationsText);

        const bestText = gameObjectCreator.bitmapText({ x: 645, y: 296, font: "font", text: "BEST" }, false);
        this.uiLayer.add(bestText);
        this.bestRecordText = gameObjectCreator.bitmapText({ x: 645, y: 378, font: "font", text: this.createBestRecordStr() }, false);
        this.uiLayer.add(this.bestRecordText);
    }

    setupPlayButton() {
        this.play.setInteractive();

        this.play.on("pointerover", () => this.play.setTint(0x44ff44));
        this.play.on("pointerout", () => this.play.clearTint());

        this.play.on("pointerup", () => {
            this.play.destroy();
            this.readyGoText.setVisible(true);
            this.progressBox.setVisible(true);
            this.progressBar.setVisible(true);

            this.clock.addEvent(this.timerEvent);
        });
    }

    setupRetryButton() {
        this.retry.setInteractive();

        this.retry.on("pointerover", () => this.retry.setTint(0x44ff44));
        this.retry.on("pointerout", () => this.retry.clearTint());

        this.retry.on("pointerdown", () => {
            if (this.isGamePlayed()) {
                this.scenePlugin.restart();
            }
        });
    }

    setupRetryLongButton() {
        this.retryLong.setInteractive();

        this.retryLong.on("pointerdown", () => {
            this.clock.addEvent(this.retryLongTimerEvent);
        });

        this.retryLong.on("pointerup", () => {
            this.retryLongTimerEvent.remove();
            this.retryLongTimerEvent = new Phaser.Time.TimerEvent({
                delay: 0,
                repeat: GameConstants.FPS - 1,
                callbackScope: this,
                callback: function (this: Ui) {
                    console.log(this.retryLongTimerEvent.getRepeatCount());
                }
            });
        });

        this.retryLong.on("pointerout", () => {
            this.retryLongTimerEvent.remove();
            this.retryLongTimerEvent = new Phaser.Time.TimerEvent({
                delay: 0,
                repeat: GameConstants.FPS - 1,
                callbackScope: this,
                callback: function (this: Ui) {
                    console.log(this.retryLongTimerEvent.getRepeatCount());
                }
            });
        });
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

    updateTimeText() {
        this.timeText!.setText(`${Utils.createFormattedTimeFromFrame(this.getElapsedFrame())}`);
    }

    updateCollectedTreasuresText() {
        const numberOfCollectedTreasures = this.queryNumberOfCollectedTreasures();
        this.collectedTreasuresText!.setText(`${numberOfCollectedTreasures}/${Utils.calculateNumberOfTreasuresInALLRounds()}`);
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